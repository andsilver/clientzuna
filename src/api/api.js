import axios from "axios";
import { config } from "../config";

export const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    "content-type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.authorization = token ? `Bearer ${token}` : "";
  return config;
});

const dataExtractor = (res) => res.data;

export const generateNonce = () =>
  api.get("/auth/nonce").then(({ data }) => {
    return data.nonce;
  });

export const verify = (nonce, message, signature) =>
  api.post("/auth/verify", { nonce, message, signature }).then(dataExtractor);

export const getNonce = (pubKey) =>
  api.post("/auth/nonce", { pubKey }).then(dataExtractor);

export const getAuthToken = (pubKey, signature) =>
  api
    .post("/auth/token", {
      pubKey,
      signature,
    })
    .then(dataExtractor);

export const getMe = () => api.get("/user/me").then(dataExtractor);

export const getHomeData = () => api.get("/home").then(dataExtractor);
export const getTopSellers = (currency) =>
  api
    .get("/top-sellers", {
      params: { currency },
    })
    .then(dataExtractor);

export const getTopBuyers = (currency) =>
  api
    .get("/top-buyers", {
      params: { currency },
    })
    .then(dataExtractor);

export const filterNfts = (params) =>
  api.get(`/nft/filter`, { params }).then(dataExtractor);

export const getNft = (tokenAddress, tokenId) =>
  api.get(`/nft/${tokenAddress}/${tokenId}`).then(dataExtractor);

export const createNftShortLink = (tokenAddress, tokenId) =>
  api.post(`/nft/${tokenAddress}/${tokenId}/short-link`).then(dataExtractor);

export const getNftBids = (tokenAddress, tokenId, offset = 0) =>
  api
    .get(`/nft/${tokenAddress}/${tokenId}/bids`, {
      params: {
        offset,
      },
    })
    .then(dataExtractor);

export const getNftActivities = (tokenAddress, tokenId, offset = 0) =>
  api
    .get(`/nft/${tokenAddress}/${tokenId}/activities`, {
      params: {
        offset,
      },
    })
    .then(dataExtractor);

export const getProfile = (pubKey) =>
  api.get(`/user/${pubKey}`).then(dataExtractor);

export const updateUser = (pubKey, data) => api.patch(`/user/${pubKey}`, data);

export const favoriteNft = (tokenAddress, tokenId) =>
  api.post(`/nft/${tokenAddress}/${tokenId}/favorite`);

export const getLikedNfts = (pubKey, offset) =>
  api
    .get(`/user/${pubKey}/nfts/liked`, {
      params: {
        offset,
      },
    })
    .then(dataExtractor);

export const getUserActivities = (pubKey, params) =>
  api.get(`/user/${pubKey}/activities`, { params }).then(dataExtractor);

export const filterActivities = (params) =>
  api.get(`/activities`, { params }).then(dataExtractor);

export const createCollection = (body) =>
  api.post("/collection", body).then(dataExtractor);

export const updateCollection = (id, body) =>
  api.patch(`/collection/${id}`, body);

export const filterCollections = (params) =>
  api.get("/collection", { params }).then(dataExtractor);

export const getOneCollection = (id) =>
  api.get(`/collection/${id}`).then(dataExtractor);

export const pinImageToIPFS = (data) =>
  api.post("/pinata/file", data).then(dataExtractor);

export const pinImagesToIPFS = (data) =>
  api.post("/pinata/files", data).then(dataExtractor);

export const pinJsonToIPFS = (data) =>
  api.post("/pinata/json", data).then(dataExtractor);

export const pinJsonsToIPFS = (data) =>
  api.post("/pinata/jsons", data).then(dataExtractor);

export const createNFT = (data) => api.post("/nft", data).then(dataExtractor);

export const createTempNFT = (data) =>
  api.post("/nft/temp", data).then(dataExtractor);

export const updateNFTSale = (tokenAddress, tokenId, data) =>
  api.post(`/nft/${tokenAddress}/${tokenId}/sale`, data);

export const removeNFTSale = (tokenAddress, tokenId) =>
  api.delete(`/nft/${tokenAddress}/${tokenId}/sale`);

export const placeBid = (tokenAddress, tokenId, bid) =>
  api.post(`/nft/${tokenAddress}/${tokenId}/bids`, bid);

export const burnNFT = (tokenAddress, tokenId) =>
  api.delete(`/nft/${tokenAddress}/${tokenId}`);

export const removeBid = (bidId) => api.delete(`/bids/${bidId}`);

export const reportUser = (data) => api.post(`/reports`, data);

export const followUser = (userAddress) =>
  api.post(`/user/${userAddress}/follow`, {});

export const getFollowers = (userAddress) =>
  api.get(`/user/${userAddress}/followers`).then(dataExtractor);

export const getFollowing = (userAddress) =>
  api.get(`/user/${userAddress}/following`).then(dataExtractor);

export const getNotifications = () =>
  api.get("/notifications").then(dataExtractor);

export const readNotifications = () => api.post("/notifications/read");

export const getRewards = (params) =>
  api.get("/rewards", { params }).then(dataExtractor);

export const getReward = (id) => api.get(`/rewards/${id}`).then(dataExtractor);

export const getUserRewards = (address, params) =>
  api.get(`/user/${address}/rewards`, { params }).then(dataExtractor);

export const getUserOtherNfts = (address, cursor) =>
  api
    .get(`/user/${address}/others`, {
      params: { cursor },
    })
    .then(dataExtractor);

export const downloadCsvFile = () =>
  api({
    url: `/collection/download-csv`,
    method: "GET",
    responseType: "blob",
  });

export const getCurrencies = () => api.get("/currencies").then(dataExtractor);

export const createBulkMintRequest = (collectionId, totalNfts) =>
  api
    .post(`/collection/${collectionId}/bulk-mint/request`, {
      totalNfts,
    })
    .then(dataExtractor);

export const uploadNftForBulkMint = (reqId, data) =>
  api.post(`/bulk-mint/${reqId}/upload-nft`, data).then(dataExtractor);

export const getBulkMintRequest = (reqId) =>
  api.get(`/bulk-mint/${reqId}`).then(dataExtractor);

export const processRequest = (reqId) =>
  api.post(`/bulk-mint/${reqId}/process`);

export const bulkMintIndexMint = (reqId, block, logs) =>
  api
    .post(`/bulk-mint/${reqId}/index/mint`, { block, logs })
    .then(dataExtractor);

export const bulkMintIndexSetPrice = (reqId, block, logs) =>
  api
    .post(`/bulk-mint/${reqId}/index/set-price`, { block, logs })
    .then(dataExtractor);

export const getCollectionBulkImports = (collectionId) =>
  api.get(`/collection/${collectionId}/bulk-mints`).then(dataExtractor);

export const addStreamEvent = (block, logs, eventType) =>
  api.post("/stream/add", {
    block,
    logs,
    eventType,
  });
