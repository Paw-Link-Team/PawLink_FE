import api from "./api";

/* =====================
 * 산책 시작
 * ===================== */
export const startWalkApi = () => {
  return api.post("/api/walks/start");
};

/* =====================
 * 산책 종료
 * ===================== */
export const endWalkApi = (distanceKm: number) => {
  return api.post("/api/walks/end", {
    distanceKm,
  });
};

/* =====================
 * 현재 산책 세션 조회 (복구용)
 * ===================== */
export const getWalkSessionApi = () => {
  return api.get("/api/walks/session");
};
