import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Fetcher, NetworkToContractAddress } from "./utils";

export const useAuthWeb3 = () => {
  const ethereum = window.ethereum;

  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [network, setNetwork] = useState<string>();
  const [address, setAddress] = useState<string>();

  const [AllowReq, setAllowReq] = useState(false);

  useEffect(() => {
    if (!ethereum) return;
    Init();

    // Listeners
    try {
      ethereum.on("accountsChanged", (accounts) => setAddress(accounts[0]));
      ethereum.on("chainChanged", async () => Init());
    } catch (err) {}
  }, [ethereum]);

  useEffect(() => {
    CheckEgibilityToReq();
  }, [network, address, provider, signer, ethereum]);

  const CheckEgibilityToReq = async () => {
    if (network !== "0x13881" || !address || !provider || !signer || !ethereum)
      setAllowReq(false);
    else setAllowReq(true);
  };

  const NetworkInfo = async () => {
    try {
      const Network = await ethereum.request<string>({ method: "eth_chainId" });

      setNetwork(Network);
      if (network !== "0x13881") {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x13881" }],
        });
      }
    } catch (err) {}
  };

  const Connect = async (CustomProvider: ethers.providers.Web3Provider) => {
    try {
      const accounts: string[] = await (provider || CustomProvider).send(
        "eth_requestAccounts",
        []
      );
      setAddress(accounts[0] || undefined);
    } catch (err) {}
  };

  const Init = async () => {
    if (!ethereum) return console.error("No Metamask");

    try {
      const provider = new ethers.providers.Web3Provider(
        ethereum as unknown as any
      );
      const signer = provider.getSigner();

      setProvider(provider);
      setSigner(signer);

      Connect(provider);
      NetworkInfo();
    } catch (err) {}
  };

  return { signer, provider, address, network, AllowReq };
};

export const useContract = (
  provider: ethers.providers.Web3Provider | undefined,
  network: string | undefined,
  allowed: boolean
) => {
  const [Contract, setContract] = useState<ethers.Contract>();
  const { data: ContractABI } = useQuery("repoData", () =>
    fetch("/BestAnimeABI.json")
      .then((res) => res.json())
      .then((res) => res.abi)
  );

  const ResetContract = () => setContract(undefined);

  useEffect(() => {
    if (!allowed || !ContractABI || !provider || !network)
      return ResetContract();

    const ContractAddress = NetworkToContractAddress(network);
    if (isNaN(parseInt(ContractAddress))) return ResetContract();

    const BAContract = new ethers.Contract(
      ContractAddress,
      ContractABI,
      provider
    );
    setContract(BAContract);
  }, [allowed, ContractABI, network]);

  return Contract;
};