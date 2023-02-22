import { BigNumber, utils } from "ethers";

export const sameAddress = (addr1, addr2) =>
  addr1?.toLowerCase() === addr2?.toLowerCase();

export const minimizeAddress = (address, start = 14, end = -11) =>
  address ? `${address.substr(0, start)}...${address.substr(end)}` : "";

export const generateRandomTokenId = () => {
  return BigNumber.from(utils.randomBytes(16)).toString();
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
  if (isNaN(num)) {
    return 0;
  }
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: digits,
  }).format(num);
}

export const copyText = (text) => navigator.clipboard.writeText(text);

export const fromWei = (value, decimals) => {
  return utils.formatUnits(value, decimals);
};

export const toWei = (value, decimals) => {
  return utils.parseUnits(value, decimals);
};

export const wait = (seconds) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));
