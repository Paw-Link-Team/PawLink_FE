import api from "./api";

// PoopStatus 정의
type PoopStatus = 'X' | 'O';

/* =====================
 * 산책 시작
 * ===================== */
export const startWalkApi = () => {
  return api.post("/api/walks/start");
};

/* =====================
 * 산책 종료
 * ===================== */
export const endWalkApi = (walkId: number, distanceKm: number, memo: string, poop: PoopStatus) => {
  return api.post(`/api/walks/${walkId}/end`, {
    distanceKm,
    memo,
    poop,
  });
};

/* =====================
 * 현재 산책 세션 조회 (복구용)
 * ===================== */
export const getWalkSessionApi = () => {
  return api.get("/api/walks/session");
};
