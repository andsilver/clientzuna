import { createContext, useContext, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";

import { config } from "../config";
import { getAuthToken, getMe, getNonce } from "../api/api";
import { getWeb3 } from "../helper/utils";

export const AuthContext = createContext({
  address: null,
  connect: () => null,
  loading: false,
  disconnect: () => null,
  chainId: null,
  isAdmin: false,
  web3: null,
  user: null,
  balance: 0,
});

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      rpc: {
        [config.chainId]: config.chainRPC,
      },
      network: config.network,
    },
  },
};
const web3Modal = new Web3Modal({
  network: config.network || "rinkeby", // optional
  cacheProvider: true, // optional
  providerOptions, // required
});

export const AuthProvider = ({ children }) => {
  const [chainId, setChainId] = useState(null);
  const [address, setAddress] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [balance, setBalance] = useState(0);

  const subscribeProvider = (provider) => {
    provider.on("disconnect", (error) => {
      console.log("Disconnected:", error);
      setChainId(null);
      setAddress(null);
    });
    provider.on("accountsChanged", (accounts) => {
      setAddress(accounts[0]);
    });
    // Subscribe to chainId change
    provider.on("chainChanged", (chainId) => {
      window.location.reload();
    });
  };

  const getBalance = async () => {
    if (!user) {
      setBalance(0);
      return;
    }
    const web3 = getWeb3();
    const value = await web3.eth.getBalance(user.pubKey);
    setBalance(parseFloat(Web3.utils.fromWei(value)).toFixed(4));
  };

  const login = async () => {
    if (user) {
      return;
    }

    try {
      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);
      subscribeProvider(provider);

      const accounts = await web3.eth.getAccounts();
      const chain = await web3.eth.getChainId();
      setAddress(accounts[0]);
      setChainId(chain);
      setWeb3(web3);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    setUser(null);
    setAddress(null);
    web3Modal.clearCachedProvider();
    localStorage.removeItem("token");
  };

  const fetchUser = async () => {
    setLoading(true);

    try {
      const res = await getMe();
      setUser(res);
    } catch (err) {
      console.error(err);
      logout();
    }
    setLoading(false);
  };

  useEffect(() => {
    getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, web3]);

  useEffect(() => {
    const handleSignMessage = async (nonce) => {
      const instance = new Web3(Web3.givenProvider);

      try {
        const signature = await instance.eth.personal.sign(
          `${config.authSignMessage}: ${nonce}`,
          address,
          ""
        );
        return signature;
      } catch (err) {
        throw new Error("You need to sign the message to be able to log in.");
      }
    };

    if (!address) {
      setUser(null);
      return;
    }
    const accessToken = localStorage.getItem("token");

    if ((!user || user.address === address) && accessToken) {
      fetchUser();
      return;
    }
    setLoading(true);

    getNonce(address)
      .then(({ nonce }) => handleSignMessage(nonce))
      .then((signature) => getAuthToken(address, signature))
      .then(({ accessToken, user }) => {
        localStorage.setItem("token", accessToken);
        setUser(user);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setUser(null);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      login();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider
      value={{
        address,
        loading,
        connect: login,
        disconnect: logout,
        chainId,
        web3,
        user,
        balance,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
