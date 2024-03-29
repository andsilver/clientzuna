import { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useNetwork, useSignMessage, useDisconnect } from "wagmi";
import { SiweMessage } from "siwe";

import { getMe, getNonce, verify } from "../api/api";
import { sameAddress } from "../helper/utils";
import {
  StyledDialog,
  StyledDialogTitle,
} from "../Components/common/DialogElements";
import { Button, DialogContent, Grid, Typography } from "@mui/material";

export const AuthContext = createContext({
  connect: () => null,
  loading: false,
  disconnect: () => null,
  isAdmin: false,
  user: null,
  fetchUser: async () => null,
  login: () => null,
});

const bc = new BroadcastChannel("auth_channel");

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();
  const { disconnectAsync } = useDisconnect();
  const [focused, setFocused] = useState(
    document.visibilityState === "visible"
  );
  const [showSignMessage, setShowSignMessage] = useState(false);

  const checkUser = async () => {
    if (!localStorage.getItem("token")) {
      setShowSignMessage(true);
      return;
    }

    try {
      const user = await getMe();

      if (sameAddress(user.pubKey, address)) {
        setUser(user);
        setLoading(false);
      } else {
        setShowSignMessage(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const login = async () => {
    const chainId = chain?.id;

    if (!address || !chainId) {
      return;
    }
    setLoading(true);

    if (!focused) {
      return;
    }

    try {
      const { nonce } = await getNonce(address);

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in to Zunaverse",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      const { accessToken, user } = await verify(nonce, message, signature);
      localStorage.setItem("token", accessToken);
      setUser(user);
      bc.postMessage("refresh");
    } catch (err) {}

    setLoading(false);
    setShowSignMessage(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    disconnectAsync();
    setUser(null);
    bc.postMessage("refresh");
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
    if (!address) {
      setUser(null);
    } else {
      checkUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const onVisibilityChange = () => {
    setFocused(document.visibilityState === "visible");
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", onVisibilityChange);

    bc.onmessage = () => {
      window.location.reload();
    };

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCloseSignMessage = () => {
    setShowSignMessage(false);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        connect: login,
        disconnect: logout,
        fetchUser,
        user,
        login,
      }}
    >
      {children}
      <StyledDialog onClose={onCloseSignMessage} open={showSignMessage}>
        <StyledDialogTitle onClose={onCloseSignMessage}>
          <Typography color="primary" fontWeight="bold">
            Sign Message
          </Typography>
        </StyledDialogTitle>
        <DialogContent>
          <Grid
            sx={{
              width: 350,
              maxWidth: "100%",
            }}
            container
            alignItems="center"
            justifyContent="center"
            spacing={2}
            direction="column"
          >
            <Grid item>
              <Typography variant="subtitle1" textAlign="center">
                Please sign the message to sign-in
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                sx={{ width: 180 }}
                onClick={login}
                disabled={loading}
              >
                Continue with wallet
              </Button>
            </Grid>
            <Grid item>
              <Button
                color="primary"
                disabled={loading}
                sx={{ width: 180 }}
                onClick={onCloseSignMessage}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </StyledDialog>
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
