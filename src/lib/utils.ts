const MUMBAI_CONTRACT = "0xFF738C6988155096F9D912daB32D9C9eBB120B1C" as const;
const POLYGON_CONTRACT = "Not Defined Yet" as const;

export const Fetcher = async (url: string) => {
  try {
    const res = await fetch(url);
    const data = await res.json();

    return data;
  } catch (err) {
    return false;
  }
};

export const NetworkToStr = (network: string) => {
  const NetInt = parseInt(network);
  if (isNaN(NetInt)) return "Unknown";

  if (NetInt === 0x13881) return "Mumbai";
  if (NetInt === 137) return "Polygon Mainnet";

  if (NetInt === 42161) return "Arbitrum";

  if (NetInt === 0x1) return "Ethereum Mainnet";
  if (NetInt === 0x3) return "Ropsten Testnet";
  if (NetInt === 0x4) return "Rinkeby Testnet";
  if (NetInt === 0x5) return "Goerli Testnet";
  if (NetInt === 0x2a) return "Kovan Testnet";

  if (NetInt === 56) return "BSC Mainnet";
  if (NetInt === 97) return "BSC Testnet";

  if (NetInt === 43114) return "Avalanche";
  if (NetInt === 43113) return "Avalanche Fuji";

  if (NetInt === 250) return "Fantom";
  if (NetInt === 4002) return "Fantom Testnet";

  if (NetInt === 27) return "ShibaChain";

  return "Unknown";
};

export const NetworkToContractAddress = (network: string) => {
  const NetInt = parseInt(network);
  if (isNaN(NetInt)) return "Unknown Contract";

  if (NetInt === 0x13881) return MUMBAI_CONTRACT;
  if (NetInt === 137) return POLYGON_CONTRACT;

  if (NetInt === 42161) return "Arbitrum Contract";

  if (NetInt === 0x1) return "Ethereum Mainnet Contract";
  if (NetInt === 0x3) return "Ropsten Testnet Contract";
  if (NetInt === 0x4) return "Rinkeby Testnet Contract";
  if (NetInt === 0x5) return "Goerli Testnet Contract";
  if (NetInt === 0x2a) return "Kovan Testnet Contract";

  if (NetInt === 56) return "BSC Contract";
  if (NetInt === 97) return "BSC Testnet Contract";

  if (NetInt === 43114) return "Avalanche Contract";
  if (NetInt === 43113) return "Avalanche Fuji Contract";

  if (NetInt === 250) return "Fantom Contract";
  if (NetInt === 4002) return "Fantom Testnet Contract";

  if (NetInt === 27) return "ShibaChain Contract";

  return "Unknown Contract";
};
