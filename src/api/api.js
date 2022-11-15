import axios from "axios";
import { config } from "../config";

const api = axios.create({
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

export const getNft = (id) => api.get(`/nft/${id}`).then(dataExtractor);

export const getNftBids = (id, offset = 0) =>
  api
    .get(`/nft/${id}/bids`, {
      params: {
        offset,
      },
    })
    .then(dataExtractor);

export const getNftActivities = (id, offset = 0) =>
  api
    .get(`/nft/${id}/activities`, {
      params: {
        offset,
      },
    })
    .then(dataExtractor);

export const getProfile = (pubKey) =>
  api.get(`/user/${pubKey}`).then(dataExtractor);

export const updateUser = (pubKey, data) => api.patch(`/user/${pubKey}`, data);

export const favoriteNft = (nftId) => api.post(`/nft/${nftId}/favorite`);

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

export const pinJsonToIPFS = (data) =>
  api.post("/pinata/json", data).then(dataExtractor);

export const createNFT = (data) => api.post("/nft", data).then(dataExtractor);

export const updateNFTSale = (tokenId, data) =>
  api.post(`/nft/${tokenId}/sale`, data);

export const removeNFTSale = (tokenId) => api.delete(`/nft/${tokenId}/sale`);

export const placeBid = (id, bid) => api.post(`/nft/${id}/bids`, bid);

export const burnNFT = (id) => api.delete(`/nft/${id}`);

export const removeBid = (id) => api.delete(`/bids/${id}`);

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
