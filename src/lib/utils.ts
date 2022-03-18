import { formatEther, parseEther } from "ethers/lib/utils";
import { ChainIdShape, NetworksNamesShape } from "../types/interface";
import ChainInfo from "./data/ChainInfo.json";
import * as ContractAddress from "./data/ContractAddress";

export const AllSupportedChain = [80001, 3, 4, 5, 42, 97, 421611, 43113];

/**
 * Reformat Images' Urls
 * @param {string} photoUrl
 */
export const ReformatImagesUrls = (photoUrl: string) =>
  photoUrl.split("?s=")[0];

/**
 * Return The ChainId of a network
 * @param {string} networkName
 * @returns {ChainIdShape} ChainIdShape
 */
export const StrNetwork = (networkName: string): ChainIdShape => {
  const ChainName = ChainInfo.find(({ name }) => name === networkName);
  return (ChainName?.chainId as ChainIdShape) || "Unknown";
};

/**
 * Return The Network Name of a network chainId
 * @param {string} network
 * @returns {NetworksNamesShape} NetworksNamesShape
 */
export const NetworkToStr = (network: string): NetworksNamesShape => {
  const NetInt = parseInt(network);
  if (isNaN(NetInt)) return "Unknown";

  const ChainName = ChainInfo.find(({ chainId }) => chainId === NetInt);
  return (ChainName?.name as NetworksNamesShape) || "Unknown";
};

/**
 * Return The Contract Address of the current network
 * @param {string} network
 */
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

/**
 * Convert Wei To Eth
 * @param {number | string} Wei
 * @returns {number} Eth Value
 */
export const WeiToEth = (Wei: number | string): number => {
  Wei = parseFloat(Wei.toString());
  if (isNaN(Wei)) return 0;
  return Wei / Math.pow(10, 18);
};

/**
 * Convert Eth To Wei
 * @param {number | string} eth
 * @returns Wei Value
 */
export const EthToWei = (eth: number | string) => parseEther(eth.toString());

/**
 * Return the price of nETH in USD
 * @param {number} ETHPrice
 * @param {string | number} NoEth
 * @param {"0" | "1"} Units
 * @returns {number} USD Value
 */
export const EthToUSD = (
  ETHPrice: number,
  NoEth: string | number,
  Units: "0" | "1"
): number => {
  NoEth = parseFloat(NoEth.toString());
  if (isNaN(ETHPrice) || isNaN(NoEth)) return 0;
  if (Units === "1") NoEth = WeiToEth(NoEth);

  return parseFloat((ETHPrice * NoEth).toFixed(2));
};
