import { useEffect, useRef, useState } from "react";
import { startWalkApi, endWalkApi } from "../api/walk";

export type WalkStatus = "BEFORE" | "WALKING" | "FINISHED";
type LatLng = { lat: number; lng: number };
type PoopStatus = "O" | "X";

export function useWalkTracker() {
  const [status, setStatus] = useState<WalkStatus>("BEFORE");
  const [path, setPath] = useState<LatLng[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);

  // ✅ walkId 저장 (시작 / 복구 공용)
  const currentWalkIdRef = useRef<number | null>(null);

  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  /* =====================
   * 거리 계산
   * ===================== */
  const calcDistance = (a: LatLng, b: LatLng) => {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const lat1 = (a.lat * Math.PI) / 180;
    const lat2 = (b.lat * Math.PI) / 180;

    const x =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

    return 2 * R * Math.asin(Math.sqrt(x));
  };

  /* =====================
   * 타이머
   * ===================== */
  const startTimer = () => {
    if (timerRef.current) return;
    timerRef.current = window.setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  /* =====================
   * GPS
   * ===================== */
  const startWatch = () => {
    if (watchIdRef.current) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const next = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setPath((prev) => {
          if (prev.length > 0) {
            setDistanceKm((d) => d + calcDistance(prev[prev.length - 1], next));
          }
          return [...prev, next];
        });
      },
      console.error,
      { enableHighAccuracy: true }
    );
  };

  const stopWatch = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  /* =====================
   * 산책 시작
   * ===================== */
  const startWalk = async () => {
    const res = await startWalkApi();

    // ✅ 서버에서 내려준 walkId 저장
    currentWalkIdRef.current = res.data.data.walkId;

    setStatus("WALKING");
    startTimer();
    startWatch();
  };

  /* =====================
   * 산책 복구 (서버 기준)
   * ===================== */
  const restoreWalk = (startedAt: string, walkId: number) => {
    currentWalkIdRef.current = walkId;

    setStatus("WALKING");

    const started = new Date(startedAt).getTime();
    setSeconds(Math.floor((Date.now() - started) / 1000));

    startTimer();
    startWatch();
  };

  /* =====================
   * 산책 종료
   * ===================== */
  const endWalk = async (memo: string, poop: PoopStatus) => {
    if (!currentWalkIdRef.current) {
      throw new Error("walkId가 없습니다.");
    }

    const res = await endWalkApi(
      currentWalkIdRef.current,
      distanceKm,
      memo,
      poop
    );

    stopTimer();
    stopWatch();
    setStatus("FINISHED");

    return res.data.data;
  };

  const avgSpeed =
    seconds > 0 ? (distanceKm / seconds) * 3600 : 0;

  useEffect(() => {
    return () => {
      stopTimer();
      stopWatch();
    };
  }, []);

  return {
    status,
    path,
    seconds,
    distanceKm,
    avgSpeed,
    startWalk,
    restoreWalk,
    endWalk,
  };
}