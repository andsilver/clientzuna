import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { config } from "../config";

const CoinGeckoContext = createContext({});

export const CoinGeckoProvider = ({ children }) => {
  const [coins, setCoins] = useState({
    WBNB: {},
  });

  const fetchCoinGeckoData = async () => {
    const { currencies } = config;
    const {
      data: [wbnb, zuna],
    } = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      params: {
        vs_currency: "usd",
        ids: `${currencies.WBNB.coinGecko},${currencies.ZUNA.coinGecko}`,
        sparkline: false,
      },
    });
    setCoins({
      WBNB: {
        price: wbnb.current_price,
        image: wbnb.image,
      },
      ZUNA: {
        price: zuna.current_price,
        image: zuna.image,
      },
    });
  };

  useEffect(() => {
    fetchCoinGeckoData();
  }, []);

  return (
    <CoinGeckoContext.Provider value={{ coins }}>
      {children}
    </CoinGeckoContext.Provider>
  );
};

export const useCoinGecko = () => useContext(CoinGeckoContext);
