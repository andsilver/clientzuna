import { createContext, useContext, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import { ethers } from "ethers";

import { config } from "../config";
import { getAuthToken, getMe, getNonce } from "../api/api";
import { getWeb3, sameAddress } from "../helper/utils";

export const AuthContext = createContext({
  address: null,
  connect: () => null,
  loading: false,
  disconnect: () => null,
  chainId: null,
  isAdmin: false,
  provider: null,
  user: null,
  balance: 0,
});

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: "2277777c3280436f956e6a3bc011bf6f",
      rpc: {
        [config.chainId]: config.chainRPC,
      },
    },
  },
};
const web3Modal = new Web3Modal({
  cacheProvider: true, // optional
  providerOptions, // required
});

export const AuthProvider = ({ children }) => {
  const [chainId, setChainId] = useState(null);
  const [address, setAddress] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [provider, setProvider] = useState(null);

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
    setBalance(parseFloat((+Web3.utils.fromWei(value)).toFixed(4)));
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
      setProvider(provider);
    } catch (err) {
      logout();
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

      if (sameAddress(res.pubKey, address)) {
        setUser(res);
      } else {
        logout();
      }
    } catch (err) {
      console.error(err);
      logout();
    }
    setLoading(false);
  };

  useEffect(() => {
    getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, provider]);

  useEffect(() => {
    const handleSignMessage = async (nonce) => {
      try {
        const p = new ethers.providers.Web3Provider(provider);
        const signer = p.getSigner();
        const domain = {
          name: "Zunaverse",
          version: "1",
        };
        return await signer._signTypedData(
          domain,
          {
            Message: [
              {
                name: "nonce",
                type: "uint256",
              },
            ],
          },
          {
            nonce,
          }
        );
      } catch (err) {
        console.error(err);
        web3Modal.clearCachedProvider();
        throw new Error("You need to sign the message to be able to log in.");
      }
    };

    if (!address || !provider) {
      setUser(null);
      return;
    }
    const accessToken = localStorage.getItem("token");

    if ((!user || sameAddress(user.address, address)) && accessToken) {
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
        web3Modal.clearCachedProvider();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, provider]);

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
        provider,
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
