import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

export type BADatasShape = [string, [string, string], string];
export type ChainIdShape =
  | 80001
  | 137
  | 1
  | 3
  | 4
  | 5
  | 42
  | 56
  | 97
  | 42161
  | 421611
  | 43114
  | 43113
  | 250
  | 4002
  | 27
  | "Unknown";
export type NetworksNamesShape =
  | "Mumbai"
  | "Polygon Mainnet"
  | "Ethereum Mainnet"
  | "Ropsten Testnet"
  | "Rinkeby Testnet"
  | "Goerli Testnet"
  | "Kovan Testnet"
  | "BSC Mainnet"
  | "BSC Testnet"
  | "Arbitrum One"
  | "Arbitrum Testnet"
  | "Avalanche"
  | "Avalanche Fuji"
  | "Fantom"
  | "Fantom Testnet"
  | "ShibaChain"
  | "Unknown";
