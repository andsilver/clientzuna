import { createContext, useContext, useEffect, useState } from "react";
import { getCurrencies } from "../api/api";
import { sameAddress } from "../helper/utils";

const CurrencyContext = createContext({
  coins: [],
  getCoinBySymbol: (symbol) => null,
  getCoinByAddress: (address) => null,
  calcUsd: (address, amount) => null,
});

export const CurrencyProvider = ({ children }) => {
  const [coins, setCoins] = useState([]);

  const fetchCurrencies = async () => {
    try {
      const currencies = await getCurrencies();
      console.log(currencies);
      setCoins(currencies);
    } catch (err) {
      console.error("Failed to fetch currencies", err);
    }
  };

  const getCoinBySymbol = (symbol) =>
    coins
      ? coins.find((c) => c.symbol.toLowerCase() === symbol.toLowerCase())
      : null;

  const getCoinByAddress = (address) =>
    coins ? coins.find((c) => sameAddress(address, c.address)) : null;

  const calcUsd = (address, amount) => {
    const coin = getCoinByAddress(address);

    if (!coin) {
      return "$0";
    }
    return parseFloat((coin.usd * +amount).toFixed(3));
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  return (
    <CurrencyContext.Provider
      value={{ coins, getCoinBySymbol, getCoinByAddress, calcUsd }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
