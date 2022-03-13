import { FC, useEffect, useMemo, useState } from "react";
// Hooks
import { useAuthWeb3, useContract } from "./lib/hooks";
import { NetworkToStr } from "./lib/utils";

/* Auction:
  1. An user pay with 2ETH
  2. If another user want to change, he must pay >2TH
  3. Ect...
*/

/* !!! Check if the input is really existing an anime */

const App: FC = () => {
  const { AllowReq, address, network, provider } = useAuthWeb3();
  const BAContract = useContract(provider, network, AllowReq);

  const [BestAnime, setBestAnime] = useState("");

  const GetBestAnimeData = async () => {
    if (!BAContract) return;
    const BestAnimeDatas = await BAContract.TheBestAnime();
    setBestAnime(BestAnimeDatas);
  };

  useEffect(() => {
    GetBestAnimeData();
  }, [BAContract]);

  const NetworkName: string = useMemo(
    () => NetworkToStr(network || "Sasaki To Miyano"),
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
      </div>
    </main>
  );
};

export default App;
