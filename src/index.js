import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { createRoot } from "react-dom/client";

import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./contexts/AuthContext";
import { Web3Provider } from "./contexts/Web3Context";
import { ColorModeProvider } from "./contexts/ThemeContext";
import { SnackbarProvider } from "./contexts/Snackbar";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { ConfirmProvider } from "./contexts/Confirm";
import WalletConnect from "./WalletConnect";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <ColorModeProvider>
          <SnackbarProvider>
            <ConfirmProvider>
              <CurrencyProvider>
                <WalletConnect>
                  <AuthProvider>
                    <Web3Provider>
                      <App />
                    </Web3Provider>
                  </AuthProvider>
                </WalletConnect>
              </CurrencyProvider>
            </ConfirmProvider>
          </SnackbarProvider>
        </ColorModeProvider>
      </LocalizationProvider>
    </HelmetProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
