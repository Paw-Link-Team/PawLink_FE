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

  // ⭐️ 이 파트가 없으면 서버는 무조건 예외
  formData.append(
    "data",
    new Blob(
      [
        JSON.stringify({
          distanceKm: payload.distanceKm,
          memo: payload.memo,
          poop: payload.poop,
        }),
      ],
      { type: "application/json" }
    )
  );

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