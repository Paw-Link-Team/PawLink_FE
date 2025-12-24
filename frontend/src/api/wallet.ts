import api from "./api";

export type WalletBalanceResponse = {
  balance: number;
};

export type WalletUseRequest = {
  amount: number;
  reason: string;
};

/** 잔액 조회 */
export const getWalletBalance = () =>
  api.get<WalletBalanceResponse>("/api/wallet/balance");

/** 포인트 충전 (amount만 받음) */
export const chargeWalletPoint = (amount: number) =>
  api.post("/api/wallet/charge", { amount });

/** 포인트 사용 (출금) */
export const useWalletPoint = (payload: WalletUseRequest) =>
  api.post("/api/wallet/use", payload);

/** 거래 내역 조회 */
export const getWalletTransactions = () =>
  api.get("/api/wallet/transactions");
