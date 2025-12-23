import api from "./api";

export type WalletBalanceResponse = {
  balance: number;
};

export type WalletUseRequest = {
  amount: number;
  reason: string;
};

export const getWalletBalance = () =>
  api.get<WalletBalanceResponse>("/api/wallet/balance");

export const useWalletPoint = (payload: WalletUseRequest) =>
  api.post("/api/wallet/use", payload);

export const getWalletTransactions = () =>
  api.get("/api/wallet/transactions");
