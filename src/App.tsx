import { FC, Fragment, useEffect, useMemo, useState } from "react";
import NavBar from "./Components/NavBar";
// Hooks
import { useAuthWeb3, useContract, useETHPrice } from "./lib/hooks";
import { EthToUSD, EthToWei, NetworkToStr, WeiToEth } from "./lib/utils";
import { BADatasShape } from "./types/interface";

interface ChangeBestAnimeProps {
  BestAnimeDatas: BADatasShape;
  SendNewBestAnime: (NewBA: string, AmountToPay: string) => Promise<void>;
}

interface DisplayBestAnimeProps {
  NetworkName: string;
  BestAnime: string;
}

// React Toast

const App: FC = () => {
  // Hooks
  const { AllowReq, address, network, provider, signer } = useAuthWeb3();
  const BAContract = useContract(provider, network, AllowReq, signer);

  // State
  const [
    [BestAnime, [LastBuyPrice, LastBuyPriceWei], CurrentOwner],
    setBestAnimeInfo,
  ] = useState<BADatasShape>(() => ["Loading...", ["0", "0"], ""]);

  // UseEffect
  useEffect(() => {
    GetBestAnimeData();
  }, [BAContract]);

  // Func
  const GetBestAnimeData = async () => {
    if (!BAContract)
      return setBestAnimeInfo(["Contract Not Found", ["0", "0"], ""]);
    try {
      const BestAnimeDatas = await BAContract.TheBestAnime();
      setBestAnimeInfo([
        BestAnimeDatas[0],
        [WeiToEth(BestAnimeDatas[1]).toString(), BestAnimeDatas[1].toString()],
        BestAnimeDatas[2],
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const SendNewBestAnime = async (NewBA: string, AmountToPay: string) => {
    if (!BAContract) return;
    if (NewBA.length < 3 || isNaN(parseInt(AmountToPay))) return;

    try {
      const setAnimeTx = await BAContract.setBestAnime(NewBA, {
        value: AmountToPay,
      });
      await setAnimeTx.wait();
      GetBestAnimeData();
    } catch (err) {
      console.error(err);
    }
  };

  const NetworkName: string = useMemo(
    () => NetworkToStr(network || "SasaMiya"),
    [network]
  );

  // JSX
  return (
    <main className="h-screen w-full text-white">
      <NavBar
        ConnectedToNet={!!BAContract}
        NetworkName={NetworkName}
        address={address}
      />
      <div className="flex h-[90%] flex-col items-center justify-center">
        <DisplayBestAnime NetworkName={NetworkName} BestAnime={BestAnime} />
        {!!signer && CurrentOwner.toLowerCase() !== address?.toLowerCase() && (
          <ChangeBestAnime
            BestAnimeDatas={[
              BestAnime,
              [LastBuyPrice, LastBuyPriceWei],
              CurrentOwner,
            ]}
            SendNewBestAnime={SendNewBestAnime}
          />
        )}
      </div>
    </main>
  );
};

function DisplayBestAnime({ NetworkName, BestAnime }: DisplayBestAnimeProps) {
  return (
    <Fragment>
      <div className="text-2xl capitalize">
        The Best Anime Of{" "}
        <span className="font-semibold text-yellow-100">{NetworkName}</span>:
      </div>
      <div className="mt-5 font-mono text-5xl font-bold uppercase text-yellow-300">
        {BestAnime}
      </div>
    </Fragment>
  );
}

function ChangeBestAnime({
  BestAnimeDatas: [_, [LastBuyPrice, LastBuyPriceWei], CurrentOwner],
  SendNewBestAnime,
}: ChangeBestAnimeProps) {
  const ETHPrice = useETHPrice();

  const [NewBA, setNewBA] = useState("");
  const [AmountToPay, setAmountToPay] = useState(() => LastBuyPrice);
  const [Units, setUnits] = useState<"0" | "1">("0");

  return (
    <form
      className="mt-10 text-center"
      onSubmit={(e) => {
        e.preventDefault();
        SendNewBestAnime(
          NewBA,
          Units === "0" ? EthToWei(AmountToPay).toString() : AmountToPay
        );
      }}
    >
      <header>
        <h1 className="mb-3 text-2xl">Want to Change to YOUR Fav Anime ? ✨</h1>
        <div className="text-left">
          <li>
            Current Owner:{" "}
            <span className="font-semibold text-yellow-200">
              {CurrentOwner}
            </span>
          </li>
          <li>
            Last Buy Price:{" "}
            <span className="font-bold text-yellow-200">
              {LastBuyPrice} ETH
            </span>{" "}
            ({EthToUSD(ETHPrice, LastBuyPrice, "0")} $)
          </li>
        </div>
        <p className="font-semibold text-yellow-500">
          YOU WILL HAVE TO PAY AN AMOUNT{" "}
          <span className="font-bold text-red-500">
            {">"}
            {LastBuyPrice} ETH
          </span>{" "}
          TO CHANGE THE ANIME
        </p>
      </header>

      <div className="mt-5">
        <div className="mb-3">
          <input
            type="text"
            value={NewBA}
            placeholder="Your Fav Anime"
            onChange={({ target: { value } }) => setNewBA(value)}
            className="rounded-lg bg-zinc-600 py-2 px-5 text-lg font-semibold outline-none transition-all focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="number"
            step={Units === "0" ? "0.0001" : "1"}
            min={Units === "0" ? LastBuyPrice : LastBuyPriceWei}
            value={AmountToPay}
            onChange={({ target: { value } }) => setAmountToPay(value)}
            className="ml-5 h-[44px] w-20 rounded-l-lg bg-zinc-600 text-center text-lg font-semibold outline-none transition-all focus:ring-2 focus:ring-yellow-500"
          />
          <select
            value={Units}
            onChange={({ target: { value } }) => setUnits(value as "0" | "1")}
            className="h-[44px] w-20 rounded-r-lg bg-zinc-600 text-center text-lg font-semibold outline-none transition-all focus:ring-2 focus:ring-yellow-500"
          >
            <option value="0">Ether</option>
            <option value="1">Wei</option>
          </select>
        </div>

        <button
          type="submit"
          className="ml-3 rounded-lg p-2 font-semibold ring-2 ring-yellow-300 transition-all hover:bg-yellow-100 
              hover:text-black focus:ring-2 focus:ring-yellow-500"
        >
          ✉ Transact (
          <span className="text-red-500">
            {Units === "1" ? WeiToEth(AmountToPay) : AmountToPay} ETH
          </span>{" "}
          ~{EthToUSD(ETHPrice, AmountToPay, Units)}$)
        </button>
      </div>
    </form>
  );
}

export default App;
