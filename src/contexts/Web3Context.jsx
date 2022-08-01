/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Web3 from "web3";
import { ethers } from "ethers";

import mediaABI from "../contracts/abis/Zuna.json";
import marketABI from "../contracts/abis/Market.json";
import erc20ABI from "../contracts/abis/erc20.json";

import { config } from "../config";
// import WrongNetwork from "../Components/WrongNetwork";
import { useAuthContext } from "./AuthContext";
import { useSnackbar } from "./Snackbar";
import { getWeb3 } from "../helper/utils";

export const Web3Context = createContext({
  wrongNetwork: false,
  contracts: {},
  getErc20Contract: (address) => undefined,
  signEIP712: async (types, data, contract) => undefined,
  getErc20Balance: (currency, address) => {},
  serviceFee: 0,
  approveMarket: async () => {},
});

export const Web3Provider = ({ children }) => {
  const { chainId, provider, user } = useAuthContext();
  const [serviceFee, setServiceFee] = useState(0);
  const { showSnackbar } = useSnackbar();

  const wrongNetwork = useMemo(() => {
    if (!chainId) {
      return true;
    }
    if (parseInt(chainId) !== config.chainId) {
      return true;
    }
    return false;
  }, [chainId]);

  const contracts = useMemo(() => {
    const instance = wrongNetwork || !provider ? getWeb3() : new Web3(provider);

    const media = new instance.eth.Contract(
      mediaABI,
      config.nftContractAddress
    );

    const market = new instance.eth.Contract(
      marketABI,
      config.marketContractAddress
    );

    return {
      media,
      market,
    };
  }, [provider, wrongNetwork]);

  const approveMarket = async () => {
    const wbnb = getErc20Contract(config.currencies.WBNB.address);
    const allowance = await wbnb.methods
      .allowance(user.pubKey, config.marketContractAddress)
      .call();
    const balance = await wbnb.methods.balanceOf(user.pubKey).call();

    const amount = +Web3.utils.fromWei(allowance);
    const bAmount = +Web3.utils.fromWei(balance);

    if (amount > 100 || bAmount === 0) {
      return;
    }
    await wbnb.methods
      .approve(
        config.marketContractAddress,
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      )
      .send({
        from: user.pubKey,
      });
  };

  const getErc20Balance = async (currency, userAddress) => {
    const erc20 = getErc20Contract(currency);
    const balance = await erc20.methods.balanceOf(userAddress).call();
    return Web3.utils.fromWei(balance);
  };

  const getServiceFee = async () => {
    if (!contracts || !contracts.market) {
      return 0;
    }
    const value = await contracts.market.methods.fee().call();
    setServiceFee(value / 1000);
  };

  const signEIP712 = async (types, data, contract) => {
    if (!provider || !chainId || !user || wrongNetwork) {
      return;
    }
    const p = new ethers.providers.Web3Provider(provider);
    const signer = p.getSigner();
    const domain = {
      ...(contract === "market" ? config.sign.market : config.sign.zuna),
    };
    return await signer._signTypedData(domain, types, data);
  };

  const showWrongNetworkWarning = () => {
    showSnackbar({
      severity: "warning",
      message: `Please switch to ${config.networkName}`,
    });
  };

  const getErc20Contract = (address) => {
    const instance = wrongNetwork || !provider ? getWeb3() : new Web3(provider);

    return new instance.eth.Contract(
      erc20ABI,
      address || config.currencies.WBNB.address
    );
  };

  useEffect(() => {
    getServiceFee();
  }, [contracts]);

  return (
    <Web3Context.Provider
      value={{
        provider,
        contracts,
        wrongNetwork,
        getErc20Contract,
        signEIP712,
        showWrongNetworkWarning,
        getErc20Balance,
        serviceFee,
        approveMarket,
      }}
    >
      {children}
      {/* <WrongNetwork show={chainId && wrongNetwork} /> */}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
