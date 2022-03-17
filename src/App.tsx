import { parseEther } from "ethers/lib/utils";
import { FC, useEffect, useMemo, useState } from "react";
// Hooks
import { useAuthWeb3, useContract } from "./lib/hooks";
import { NetworkToStr } from "./lib/utils";
import { BADatasShape } from "./types/interface";

/* !!! Check if the input is really existing an anime */

const App: FC = () => {
  const { AllowReq, address, network, provider } = useAuthWeb3();
  const BAContract = useContract(provider, network, AllowReq);

  const [[BestAnime, LastBuyPrice, CurrentOwner], setBestAnimeInfo] =
    useState<BADatasShape>(["Loading...", 0, ""]);
  const [NewBA, setNewBA] = useState("");
  const [AmountToPay, setAmountToPay] = useState(() => LastBuyPrice);

  useEffect(() => {
    GetBestAnimeData();
  }, [BAContract]);

  const GetBestAnimeData = async () => {
    if (!BAContract) return;
    try {
      const BestAnimeDatas = await BAContract.TheBestAnime();
      setBestAnimeInfo(BestAnimeDatas);
    } catch (err) {
      console.error(err);
    }
  };

  const SendNewBestAnime = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!BAContract) return;
    if (NewBA.length < 3) return;

    const setAnimeTx = await BAContract.setBestAnime(NewBA, {
      value: parseEther(AmountToPay.toString()),
    });
    await setAnimeTx.wait();
  };

  const NetworkName: string = useMemo(
    () => NetworkToStr(network || "SasaMiya"),
    [network]
  );

  return (
    <main className="h-screen w-full text-white">
      <nav className="mx-4 flex h-[10%] justify-evenly">
        <div className="flex items-center justify-center">
          <button
            className="rounded-lg bg-yellow-500 p-2 font-bold text-black transition-all focus:ring-2 
          focus:ring-yellow-700"
          >
            👋 {`${address?.slice(0, 5)}...${address?.slice(38)}`}
          </button>
        </div>
        <div className="flex items-center justify-center">
          <button
            className="rounded-lg bg-yellow-500 p-2 text-black  transition-all focus:ring-2 
          focus:ring-yellow-700"
          >
            Network: <span className="font-bold">{NetworkName}</span>
          </button>
        </div>
        <div className="flex items-center justify-center">
          <button
            className="rounded-lg bg-yellow-500 p-2 font-bold text-black transition-all focus:ring-2 
          focus:ring-yellow-700"
          >
            Contract {BAContract ? "Connected" : "Not Connected"}
          </button>
        </div>
      </nav>
      <div className="flex h-[90%] flex-col items-center justify-center">
        <div className="text-2xl capitalize">
          The Best Anime Of{" "}
          <span className="font-semibold text-yellow-100">{NetworkName}</span>:
        </div>

        <div className="mt-5 font-mono text-5xl font-bold uppercase text-yellow-300">
          {BestAnime}
        </div>

        <form className="mt-10 text-center" onSubmit={SendNewBestAnime}>
          <header>
            <h1 className="mb-3 text-2xl">
              Want to Change to YOUR Fav Anime ? ✨
            </h1>
            <div className="mb-2 text-left">
              <li>
                Current Owner:{" "}
                <span className="font-semibold text-yellow-200">
                  {CurrentOwner}
                </span>
              </li>
              <li>
                Last Buy Price:{" "}
                <span className="font-bold text-yellow-200">
                  {LastBuyPrice.toString()} ETH
                </span>
              </li>
            </div>
            <p className="font-semibold text-red-500">
              YOU WILL HAVE TO PAY AN AMOUNT ABOVE THE "Last Buy Price" TO
              CHANGE THE ANIME: {">"}
              {LastBuyPrice.toString()} ETH
            </p>
          </header>
          <div className="mt-5">
            <input
              type="text"
              value={NewBA}
              placeholder="Your Fav Anime"
              onChange={({ target: { value } }) => setNewBA(value)}
              className="rounded-lg bg-zinc-600 py-2 px-5 text-lg font-semibold outline-none transition-all focus:ring-2 focus:ring-yellow-500"
            />
            <input
              type="number"
              step={"0.0001"}
              min={LastBuyPrice.toString()}
              value={AmountToPay}
              placeholder="Amount"
              onChange={({ target: { valueAsNumber } }) =>
                setAmountToPay(valueAsNumber)
              }
              className="w-20 rounded-lg bg-zinc-600 py-2 text-center text-lg font-semibold outline-none transition-all focus:ring-2 focus:ring-yellow-500"
            />
            <button
              type="submit"
              className="ml-3 rounded-lg p-2 font-semibold ring-2 ring-yellow-300 transition-all hover:bg-yellow-100 
              hover:text-black focus:ring-2 focus:ring-yellow-500"
            >
              ✉ Transact (
              <span className="text-red-500">
                {LastBuyPrice.toString()} ETH
              </span>
              )
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default App;
