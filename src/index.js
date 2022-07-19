import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./contexts/AuthContext";
import { Web3Provider } from "./contexts/Web3Context";
import { ColorModeProvider } from "./contexts/ThemeContext";
import { SnackbarProvider } from "./contexts/Snackbar";
import { CoinGeckoProvider } from "./contexts/CoinGeckoContext";
import { ConfirmProvider } from "./contexts/Confirm";

ReactDOM.render(
  <React.StrictMode>
    <ColorModeProvider>
      <SnackbarProvider>
        <ConfirmProvider>
          <CoinGeckoProvider>
            <AuthProvider>
              <Web3Provider>
                <App />
              </Web3Provider>
            </AuthProvider>
          </CoinGeckoProvider>
        </ConfirmProvider>
      </SnackbarProvider>
    </ColorModeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
