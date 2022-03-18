import {
  FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import NavBar from "./Components/NavBar";
import debounce from "lodash.debounce";
// Hooks
import { useAuthWeb3, useContract, useETHPrice } from "./lib/hooks";
import {
  EthToUSD,
  EthToWei,
  NetworkToStr,
  ReformatImagesUrls,
  WeiToEth,
} from "./lib/utils";
import { AnimeDatasShape, BADatasShape, JikanApiRes } from "./types/interface";

interface ChangeBestAnimeProps {
  BestAnimeDatas: BADatasShape;
  SendNewBestAnime: (NewBA: string, AmountToPay: string) => Promise<void>;
}
interface DisplayBestAnimeProps {
  NetworkName: string;
  BestAnime: string;
}
type AnimeItemProps = AnimeDatasShape & {
  target: string;
  setNewBA: (newBA: string) => void;
  setNewRender: React.Dispatch<React.SetStateAction<JSX.Element[] | undefined>>;
};

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

      if (BestAnimeDatas[2].toLowerCase() === address?.toLowerCase())
        toast.success("You're The Owner !", {
          style: {
            border: "1px solid rgb(6 182 212)",
            padding: "16px",
            color: "rgb(6 182 212)",
          },
        });
    } catch (err) {
      console.error(err);
    }
  };

  const SendNewBestAnime = async (NewBA: string, AmountToPay: string) => {
    if (!BAContract) return;

    if (NewBA.length < 3 || isNaN(parseInt(AmountToPay))) {
      toast.error("Please Fill An Anime");
      return;
    }

    if (parseInt(AmountToPay) < parseInt(LastBuyPriceWei)) {
      toast.error(`You have to pay >${LastBuyPrice}ETH`);
      return;
    }

    try {
      const setAnimeTx = await BAContract.setBestAnime(NewBA, {
        value: AmountToPay,
      });
      const tx = await setAnimeTx.wait();
      const event = tx?.events[1];
      const BASet = event && event?.args[0];

      if (BASet === NewBA) toast.success("New BestAnime set!");
      GetBestAnimeData();
    } catch (err) {
      toast.error((err as any)?.data?.message);
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
        {AllowReq &&
          !!signer &&
          CurrentOwner.toLowerCase() !== address?.toLowerCase() && (
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
      <div className=" text-2xl capitalize">
        The Best Anime Of{" "}
        <span className="font-semibold text-yellow-100">{NetworkName}</span>:
      </div>
      <div className="mt-5 text-center font-mono text-5xl font-bold uppercase text-yellow-300">
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

  const [RenderedAnimes, setNewRender] = useState<JSX.Element[]>();
  const JumpNextCall = useRef(false);

  useEffect(() => {
    if (JumpNextCall.current) {
      JumpNextCall.current = false;
      return;
    }

    checkWritting(NewBA);
  }, [NewBA]);

  const handleChangeBA = useCallback((newBA: string) => {
    JumpNextCall.current = true;
    setNewBA(newBA);
  }, []);

  const checkWritting = useCallback(
    debounce(async (AnimeTitle: string) => {
      AnimeTitle = AnimeTitle.toLowerCase().trim();
      if (AnimeTitle.length <= 0) return;

      const API_URL_CALL = encodeURI(
        `https://api.jikan.moe/v4/anime?q=${AnimeTitle}&limit=16`
      );

      const res = await fetch(API_URL_CALL);
      const data: JikanApiRes = await res.json();

      const RawAnimesDatas = data.data;
      const AnimesDatas = RawAnimesDatas.map(
        ({ title, images, score, type }): AnimeDatasShape => ({
          name: title,
          image: ReformatImagesUrls(images.jpg.small_image_url),
          score,
          type,
        })
      );

      const RenderJSX = AnimesDatas.map((AnimeData, i) => (
        <AnimeItem
          key={i}
          {...{
            ...AnimeData,
            ...{ target: AnimeTitle },
            ...{ setNewBA: handleChangeBA },
            ...{ setNewRender },
          }}
        />
      ));
      setNewRender(RenderJSX);
    }, 600),
    []
  );

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
        <div className="relative mb-3">
          <input
            type="text"
            value={NewBA}
            placeholder="Your Fav Anime"
            onChange={({ target: { value } }) => setNewBA(value)}
            className="rounded-lg bg-zinc-600 py-2 px-5 text-lg font-semibold outline-none transition-all focus:ring-2 focus:ring-yellow-500"
          />

          {RenderedAnimes && (
            <div className="absolute rounded-md bg-zinc-700 p-2">
              {RenderedAnimes}
            </div>
          )}

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

function AnimeItem({
  name,
  image,
  score,
  type,
  target,
  setNewBA,
  setNewRender,
}: AnimeItemProps) {
  const HighlightTarget = () => {
    const NameLC = name.toLowerCase();
    const TargetLC = target.toLowerCase();

    const TargatedAnime = NameLC.replace(
      TargetLC,
      `<span class="text-yellow-400">${TargetLC}</span>`
    );
    return { __html: TargatedAnime };
  };

  return (
    <Fragment>
      <div
        className="mb-2 grid cursor-pointer grid-cols-12 items-center justify-items-center gap-x-2"
        onClick={() => {
          setNewBA(name);
          setNewRender(undefined);
        }}
      >
        <img
          src={image}
          alt="Anime Poster"
          className="col-span-2 hidden h-[100px] rounded-md sm:block"
        />
        <p
          className="col-span-6 text-justify font-bold capitalize"
          dangerouslySetInnerHTML={HighlightTarget()}
        ></p>
        <p className="col-span-2 font-semibold text-yellow-300">⭐ {score}</p>
        <p className="col-span-2">{type}</p>
      </div>
      <hr className="block sm:hidden" />
    </Fragment>
  );
}

export default App;
