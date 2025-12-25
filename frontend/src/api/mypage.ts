import api from "./api";

export const getMyInfo = () => api.get("/mypage/info");

export const getPetInfo = () => api.get("/pet/info");

export const getWalkHistory = () => api.get("/api/walk-histories");

export const getWalletBalance = () => api.get("/api/wallet/balance");
