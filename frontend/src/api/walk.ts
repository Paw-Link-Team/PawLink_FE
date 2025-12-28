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
export type EndWalkPayload = {
  distanceKm: number;
  memo: string;
  poop: PoopStatus;
  images?: File[];
};

export const endWalkApi = (
  walkSessionId: number,
  payload: EndWalkPayload
) => {
  const formData = new FormData();

  formData.append("distanceKm", String(payload.distanceKm));
  formData.append("memo", payload.memo);
  formData.append("poop", payload.poop);

  payload.images?.forEach((file) => {
    formData.append("images", file);
  });

  return api.post(`/api/walks/${walkSessionId}/end`, formData);
};


/* =====================
 * 현재 산책 세션 조회 (복구용)
 * ===================== */
export const getWalkSessionApi = () => {
  return api.get("/api/walks/session");
};