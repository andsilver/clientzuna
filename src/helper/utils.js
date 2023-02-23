import { BigNumber, utils } from "ethers";
import { config } from "../config";

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

const topics = [
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
  "0xee101220bc97ee214fc4e7643a015f27f7362e7d3bfa1ce8ec911c9ce7ae8ee6",
  "0x0e5399930fdcba38037ada5263bee00f5f587f8cc301ad72d02113fdaea10454",
  "0x70c2398672297895be58f2db6fb72c1f5395909f266db7bb25e557545cffdccb",
  "0x69e0c42f8f93a15104bf76fb82e77e46d0af18278924ca1d45f0d087727150b0",
  "0x2da2a946c794e9ad7ceda69deeb5e724c5463c3b98df56b021c26e4148457f63",
];

export const convertTxReceipt = (receipt, tokenAddress) => {
  const { logs: rawLogs, blockHash, blockNumber } = receipt;
  const block = {
    number: blockNumber,
    hash: blockHash,
    timestamp: `${Math.round(Date.now() / 1000)}`,
  };
  const logs = rawLogs
    .filter(
      (l) =>
        [
          (tokenAddress || config.nftContractAddress).toLowerCase(),
          config.marketContractAddress.toLowerCase(),
          config.market2ContractAddress.toLowerCase(),
        ].includes(l.address.toLowerCase()) && topics.includes(l.topics[0])
    )
    .map((l) => ({
      logIndex: l.logIndex,
      transactionHash: l.transactionHash,
      address: l.address,
      data: l.data,
      topic0: l.topics[0],
      topic1: l.topics[1],
      topic2: l.topics[2],
      topic3: l.topics[3],
    }));

  return { block, logs };
};
