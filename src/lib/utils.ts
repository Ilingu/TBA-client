import { formatEther, parseEther } from "ethers/lib/utils";
import { ChainIdShape, NetworksNamesShape } from "../types/interface";
import ChainInfo from "./data/ChainInfo.json";
import * as ContractAddress from "./data/ContractAddress";

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

export const StrNetwork = (networkName: string): ChainIdShape => {
  const ChainName = ChainInfo.find(({ name }) => name === networkName);
  return (ChainName?.chainId as ChainIdShape) || "Unknown";
};

export const NetworkToStr = (network: string): NetworksNamesShape => {
  const NetInt = parseInt(network);
  if (isNaN(NetInt)) return "Unknown";

  const ChainName = ChainInfo.find(({ chainId }) => chainId === NetInt);
  return (ChainName?.name as NetworksNamesShape) || "Unknown";
};

export const NetworkToContractAddress = (network: string) => {
  const NetInt = parseInt(network);
  if (isNaN(NetInt)) return "Unknown Contract";

  if (NetInt === 0x13881) return ContractAddress.MUMBAI_CONTRACT;
  if (NetInt === 137) return ContractAddress.POLYGON_CONTRACT;

  if (NetInt === 0x1) return ContractAddress.ETHEREUM_CONTRACT;
  if (NetInt === 0x3) return ContractAddress.ROPSTEN_CONTRACT;
  if (NetInt === 0x4) return ContractAddress.RINKEBY_CONTRACT;
  if (NetInt === 0x5) return ContractAddress.GOERLI_CONTRACT;
  if (NetInt === 0x2a) return ContractAddress.KOVAN_CONTRACT;

  if (NetInt === 56) return ContractAddress.BSC_CONTRACT;
  if (NetInt === 97) return ContractAddress.BSC_TESTNET_CONTRACT;

  if (NetInt === 42161) return ContractAddress.ARBITRUM_CONTRACT;
  if (NetInt === 421611) return ContractAddress.ARBITRUM_TESTNET_CONTRACT;

  if (NetInt === 43114) return ContractAddress.AVALANCHE_CONTRACT;
  if (NetInt === 43113) return ContractAddress.FUJI_CONTRACT;

  if (NetInt === 250) return ContractAddress.FANTOM_CONTRACT;
  if (NetInt === 4002) return ContractAddress.FANTOM_TESTNET_CONTRACT;

  if (NetInt === 27) return "ShibaChain Contract";

  return "Unknown Contract";
};

export const WeiToEth = (Wei: number | string) =>
  parseFloat(formatEther(BigInt(parseInt(Wei.toString()))));
export const EthToWei = (eth: number | string) => parseEther(eth.toString());

export const EthToUSD = (
  ETHPrice: number,
  NoEth: string | number,
  Units: "0" | "1"
) => {
  NoEth = parseFloat(NoEth.toString());
  if (isNaN(ETHPrice) || isNaN(NoEth)) return 0;
  if (Units === "1") NoEth = WeiToEth(NoEth);

  return parseFloat((ETHPrice * NoEth).toFixed(2));
};
