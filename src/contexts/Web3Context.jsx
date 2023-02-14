/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useChainId, useProvider, useSigner, useSignTypedData } from "wagmi";
import { Contract } from "ethers";

import mediaABI from "../contracts/abis/Zuna.json";
import marketABI from "../contracts/abis/Market.json";
import erc20ABI from "../contracts/abis/erc20.json";
import market2ABI from "../contracts/abis/Market2.json";
import erc721ABI from "../contracts/abis/erc721.json";
import { config } from "../config";
import { useAuthContext } from "./AuthContext";
import { useSnackbar } from "./Snackbar";
import { fromWei } from "../helper/utils";
import { useConfirm } from "./Confirm";
import { useCurrency } from "./CurrencyContext";

export const Web3Context = createContext({
  wrongNetwork: false,
  getErc20Contract: (address) => undefined,
  getErc721Contract: (address) => undefined,
  signEIP712: async (types, data, contract) => undefined,
  getErc20Balance: async (currency, address) => {},
  serviceFee: 0,
  approveMarket: async () => {},
  approveNFT: async () => {},
  marketContract: null,
  mediaContract: null,
  market2Contract: null,
});

export const Web3Provider = ({ children }) => {
  const { user } = useAuthContext();
  const [serviceFee, setServiceFee] = useState(0);
  const { showSnackbar } = useSnackbar();
  const confirm = useConfirm();
  const { getCoinByAddress } = useCurrency();
  const chainId = useChainId();
  const { signTypedDataAsync } = useSignTypedData();
  const { data: signer } = useSigner();
  const provider = useProvider({
    chainId: config.chainId,
  });
  const mediaContract = useMemo(
    () => new Contract(config.nftContractAddress, mediaABI, signer || provider),
    [signer, provider]
  );
  const marketContract = useMemo(
    () =>
      new Contract(config.marketContractAddress, marketABI, signer || provider),
    [signer, provider]
  );
  const market2Contract = useMemo(
    () =>
      new Contract(
        config.market2ContractAddress,
        market2ABI,
        signer || provider
      ),
    [signer, provider]
  );

  const wrongNetwork = useMemo(() => {
    if (!chainId) {
      return true;
    }
    if (parseInt(chainId) !== config.chainId) {
      return true;
    }
    return false;
  }, [chainId]);

  const approveMarket = async (erc20Address, marketAddress) => {
    const erc20 = getErc20Contract(erc20Address);
    const allowance = await erc20.allowance(
      user.pubKey,
      marketAddress || config.marketContractAddress
    );
    const balance = await erc20.balanceOf(user.pubKey);

    const coin = getCoinByAddress(erc20Address);

    if (!coin) {
      throw new Error("Unspported coin");
    }
    const decimals = coin.decimals;
    const amount = +fromWei(allowance.toString(), decimals);
    const bAmount = +fromWei(balance.toString(), decimals);

    if (amount > 100 || bAmount === 0) {
      return;
    }
    await erc20.approve(
      marketAddress || config.marketContractAddress,
      "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
    );
  };

  const approveNFT = async (erc721Address, marketAddress) => {
    const erc721Contract = getErc721Contract(erc721Address);

    const marketplaceApproved = await erc721Contract.isApprovedForAll(
      user.pubKey,
      marketAddress || config.marketContractAddress
    );

    if (!marketplaceApproved) {
      await confirm({
        title: "APPROVE MARKETPLACE",
        text: "One-time Approval for further transactions",
        cancelText: "",
        okText: "Approve",
      });

      await erc721Contract.setApprovalForAll(
        marketAddress || config.marketContractAddress,
        true
      );
    }
  };

  const getErc20Balance = async (currency, userAddress) => {
    const coin = getCoinByAddress(currency);

    if (!coin) {
      return "";
    }
    const erc20 = getErc20Contract(currency);
    const balance = await erc20.balanceOf(userAddress);
    return fromWei(balance.toString(), coin.decimals);
  };

  const getServiceFee = async () => {
    const value = await marketContract.fee();
    setServiceFee(value / 1000);
  };

  const signEIP712 = async (types, data, contract) => {
    if (!user || wrongNetwork) {
      return;
    }
    const domain = {
      ...(contract === "market"
        ? config.sign.market
        : contract === "market2"
        ? config.sign.market2
        : config.sign.zuna),
    };

    return await signTypedDataAsync({
      domain,
      types,
      value: data,
    });
    // return await signer._signTypedData(domain, types, data);
  };

  const showWrongNetworkWarning = () => {
    showSnackbar({
      severity: "warning",
      message: `Please switch to ${config.networkName}`,
    });
  };

  const getErc20Contract = (address) => {
    return new Contract(address, erc20ABI, signer || provider);
  };

  const getErc721Contract = (address) => {
    return new Contract(address, erc721ABI, signer || provider);
  };

  useEffect(() => {
    if (!marketContract) {
      return;
    }
    getServiceFee();
  }, [marketContract]);

  return (
    <Web3Context.Provider
      value={{
        provider,
        wrongNetwork,
        getErc20Contract,
        signEIP712,
        showWrongNetworkWarning,
        getErc20Balance,
        getErc721Contract,
        serviceFee,
        approveMarket,
        approveNFT,
        mediaContract,
        marketContract,
        market2Contract,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
