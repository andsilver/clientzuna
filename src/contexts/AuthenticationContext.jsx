import { createContext, useEffect, useState } from "react";
import { useAccount, useNetwork, useSignMessage } from "wagmi";

export const AuthenticationContext = createContext({
  address: null,
  status: "loading",
  chainId: null,
  isAdmin: false,
  provider: null,
  user: null,
  balance: 0,
});

export const AuthenticationProvider = ({ children }) => {
  const { address } = useAccount();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!address) {
      setStatus("unauthenticated");
    } else if (token) {
      setStatus("loading");
    } else {
      
    }
  }, []);
};
