import Web3 from "web3";

import { config } from "../config";

export const sameAddress = (addr1, addr2) =>
  addr1?.toLowerCase() === addr2?.toLowerCase();

export const minimizeAddress = (address, start = 14, end = -11) =>
  address ? `${address.substr(0, start)}...${address.substr(end)}` : "";

export const generateRandomTokenId = () => {
  return Web3.utils.randomHex(32);
};

export function timeSince(date) {
  var seconds = Math.floor((new Date() - new Date(date)) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

export function nFormatter(num, digits = 2) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : parseFloat(item).toFixed(digits);
}

const currenciesMapping = Object.keys(config.currencies).reduce(
  (mapping, currency) => {
    mapping[config.currencies[currency].address.toLowerCase()] = currency;
    return mapping;
  },
  {}
);

export const currencyAddressToSymbol = (currencyAddress) =>
  currenciesMapping[currencyAddress.toLowerCase()];

export const currencySymbolToAddress = (symbol) =>
  config.currencies[symbol].address.toLowerCase();

export const currencyList = () =>
  Object.entries(config.currencies).map(([key, value]) => ({
    value: value.address,
    label: key,
  }));

export const getCurrencyDecimals = (currencyAddressOrSymbol) => {
  const symbol = Web3.utils.isAddress(currencyAddressOrSymbol)
    ? currencyAddressToSymbol(currencyAddressOrSymbol)
    : currencyAddressOrSymbol;
  const currency = config.currencies[symbol.toUpperCase()];
  return currency.decimals;
};

export const getWeb3 = (rpc) => new Web3(rpc || config.chainRPC);

export const copyText = (text) => navigator.clipboard.writeText(text);

export const fromWei = (value, decimals) => {
  if (decimals === 18) {
    return Web3.utils.fromWei(value);
  } else if (decimals === 9) {
    return Web3.utils.fromWei(value, "gwei");
  }
  const bn = Web3.utils.toBN(value);
  const ten = Web3.utils.toBN(10);
  return bn.div(ten.pow(Web3.utils.toBN(decimals))).toString();
};

export const toWei = (value, decimals) => {
  if (decimals === 18) {
    return Web3.utils.toWei(value);
  } else if (decimals === 9) {
    return Web3.utils.toWei(value, "gwei");
  }
  const bn = Web3.utils.toBN(value);
  const ten = Web3.utils.toBN(10);
  return bn.mul(ten.pow(Web3.utils.toBN(decimals))).toString();
};
