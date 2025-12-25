import api from "./api";

export const startWalk = () =>
  api.post("/api/walks/start");

export const endWalk = (distanceKm: number) =>
  api.post("/api/walks/end", { distanceKm });

export const getWalkSession = () =>
  api.get("/api/walks/session");