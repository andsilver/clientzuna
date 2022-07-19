/* eslint-disable react-hooks/exhaustive-deps */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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
});

export const Web3Provider = ({ children }) => {
  const { chainId, web3, user } = useAuthContext();
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
  },[chainId])

  const contracts = useMemo(() => {
    const instance = wrongNetwork || !web3 ? getWeb3() : web3;

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
  }, [web3, wrongNetwork]);

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
    if (!web3 || !chainId || !user || wrongNetwork) {
      return;
    }
    const provider = new ethers.providers.Web3Provider(web3.currentProvider);
    const signer = provider.getSigner();
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
    const instance = wrongNetwork || !web3 ? getWeb3() : web3;

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
        web3,
        contracts,
        wrongNetwork,
        getErc20Contract,
        signEIP712,
        showWrongNetworkWarning,
        getErc20Balance,
        serviceFee,
      }}
    >
      {children}
      {/* <WrongNetwork show={chainId && wrongNetwork} /> */}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
