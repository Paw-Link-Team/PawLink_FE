import api from "./api";

export const getMyInfo = () => api.get("/mypage/info");
