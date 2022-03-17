import ChainInfo from "./ChainInfo.json";

const POLYGON_CONTRACT = "Not Defined Yet" as const;
const MUMBAI_CONTRACT = "0xb3d1Bd4c8CFE57e453B79237337981b1F6c4fa62" as const;

const ETHEREUM_CONTRACT = "Not Defined Yet" as const;
const ROPSTEN_CONTRACT = "0xa62F4daFc89E1c94FB2D819d2BC315fd15c3b21C" as const;
const GOERLI_CONTRACT = "0xa62F4daFc89E1c94FB2D819d2BC315fd15c3b21C" as const;
const RINKEBY_CONTRACT = "0x987966335D5BAb745ea8644756DA59f97c1e22de" as const;
const KOVAN_CONTRACT = "0xa62F4daFc89E1c94FB2D819d2BC315fd15c3b21C" as const;

const BSC_CONTRACT = "Not Defined Yet" as const;
const BSC_TESTNET_CONTRACT =
  "0xf1E1E138f6d827C62EECCadA87a65B530b33045C" as const;

const ARBITRUM_CONTRACT = "Not Defined Yet" as const;
const ARBITRUM_TESTNET_CONTRACT =
  "0x1777DdDb054A561c998ac630Dbb8049B10f803c0" as const;

const AVALANCHE_CONTRACT = "Not Defined Yet" as const;
const FUJI_CONTRACT = "0x1777DdDb054A561c998ac630Dbb8049B10f803c0" as const;

const FANTOM_CONTRACT = "Not Defined Yet" as const;
const FANTOM_TESTNET_CONTRACT = "Not Defined Yet" as const;

export const Fetcher = async (url: string) => {
  try {
    const res = await fetch(url);
    const data = await res.json();

    return data;
  } catch (err) {
    return false;
  }
};

export const AllSupportedChain = [80001, 3, 4, 5, 42, 97, 421611, 43113];

export const StrNetwork = (networkName: string) => {
  const ChainName = ChainInfo.find(({ name }) => name === networkName);
  return ChainName?.chainId || "Unknown";
};

export const NetworkToStr = (network: string) => {
  const NetInt = parseInt(network);
  if (isNaN(NetInt)) return "Unknown";

  const ChainName = ChainInfo.find(({ chainId }) => chainId === NetInt);
  return ChainName?.name || "Unknown";
};

export const NetworkToContractAddress = (network: string) => {
  const NetInt = parseInt(network);
  if (isNaN(NetInt)) return "Unknown Contract";

  if (NetInt === 0x13881) return MUMBAI_CONTRACT;
  if (NetInt === 137) return POLYGON_CONTRACT;

  if (NetInt === 0x1) return ETHEREUM_CONTRACT;
  if (NetInt === 0x3) return ROPSTEN_CONTRACT;
  if (NetInt === 0x4) return RINKEBY_CONTRACT;
  if (NetInt === 0x5) return GOERLI_CONTRACT;
  if (NetInt === 0x2a) return KOVAN_CONTRACT;

  if (NetInt === 56) return BSC_CONTRACT;
  if (NetInt === 97) return BSC_TESTNET_CONTRACT;

  if (NetInt === 42161) return ARBITRUM_CONTRACT;
  if (NetInt === 421611) return ARBITRUM_TESTNET_CONTRACT;

  if (NetInt === 43114) return AVALANCHE_CONTRACT;
  if (NetInt === 43113) return FUJI_CONTRACT;

  if (NetInt === 250) return FANTOM_CONTRACT;
  if (NetInt === 4002) return FANTOM_TESTNET_CONTRACT;

  if (NetInt === 27) return "ShibaChain Contract";

  return "Unknown Contract";
};
