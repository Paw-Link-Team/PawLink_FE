import api from "./api";

type PoopStatus = "X" | "O";

/* =====================
 * 산책 시작
 * ===================== */
export const startWalkApi = () => {
  return api.post("/api/walks/start");
};

/* =====================
 * 산책 종료 (multipart)
 * ===================== */
export const endWalkApi = (
  walkId: number,
  distanceKm: number,
  memo: string,
  poop: PoopStatus
) => {
  const formData = new FormData();

  formData.append("distanceKm", String(distanceKm));
  formData.append("memo", memo);
  formData.append("poop", poop);

  return api.post(`/api/walks/${walkId}/end`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* =====================
 * 현재 산책 세션 조회 (복구용)
 * ===================== */
export const getWalkSessionApi = () => {
  return api.get("/api/walks/session");
};