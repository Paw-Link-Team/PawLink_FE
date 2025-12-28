import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

/* =====================
 * 타입
 * ===================== */
export type WalkStatus = "BEFORE" | "WALKING" | "FINISHED";
export type PoopStatus = "O" | "X";

type LatLng = {
    lat: number;
    lng: number;
};

/* =====================
 * Hook
 * ===================== */
export function useWalkTracker() {
    const navigate = useNavigate();

    /* ---------- 상태 ---------- */
    const [status, setStatus] = useState<WalkStatus>("BEFORE");
    const [path, setPath] = useState<LatLng[]>([]);
    const [seconds, setSeconds] = useState(0);
    const [distanceKm, setDistanceKm] = useState(0);
    const [avgSpeed, setAvgSpeed] = useState(0);

    /* ---------- ref ---------- */
    const walkIdRef = useRef<number | null>(null);
    const timerRef = useRef<number | null>(null);
    const watchIdRef = useRef<number | null>(null);

    /* =====================
     * 거리 계산 (Haversine)
     * ===================== */
    const calcDistanceKm = (a: LatLng, b: LatLng) => {
        const R = 6371; // 지구 반경 (km)
        const dLat = ((b.lat - a.lat) * Math.PI) / 180;
        const dLng = ((b.lng - a.lng) * Math.PI) / 180;
        const lat1 = (a.lat * Math.PI) / 180;
        const lat2 = (b.lat * Math.PI) / 180;

        const h =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1) *
            Math.cos(lat2) *
            Math.sin(dLng / 2) ** 2;

        return 2 * R * Math.asin(Math.sqrt(h));
    };

    /* =====================
     * 타이머
     * ===================== */
    const startTimer = () => {
        timerRef.current = window.setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    /* =====================
     * GPS 추적 시작
     * ===================== */
    const startTracking = () => {
        watchIdRef.current = navigator.geolocation.watchPosition(
            (pos) => {
                const next: LatLng = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                };

                setPath((prev) => {
                    if (prev.length > 0) {
                        const last = prev[prev.length - 1];
                        const dist = calcDistanceKm(last, next);

                        // 5m 미만 이동은 노이즈로 무시
                        if (dist < 0.005) return prev;

                        setDistanceKm((d) => {
                            const newDist = d + dist;

                            // 평균 속도 갱신
                            if (seconds > 0) {
                                setAvgSpeed(newDist / (seconds / 3600));
                            }

                            return newDist;
                        });
                    }

                    return [...prev, next];
                });
            },
            (err) => {
                console.error("GPS 오류:", err);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 10000,
            }
        );
    };

    const stopTracking = () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
    };

    /* =====================
     * 산책 시작
     * ===================== */
    const startWalk = async () => {
        try {
            const res = await api.post("/api/walks/start");
            walkIdRef.current = res.data.data.walkId;

            // walkId 확인
            console.log("Start Walk ID:", walkIdRef.current);

            // 초기화
            setPath([]);
            setSeconds(0);
            setDistanceKm(0);
            setAvgSpeed(0);

            setStatus("WALKING");
            startTimer();
            startTracking();
        } catch (err) {
            console.error("산책 시작 오류:", err);
        }
    };

    /* =====================
     * 산책 종료 (저장)
     * ===================== */
    const endWalk = async (memo: string, poop: PoopStatus) => {
        if (!walkIdRef.current) return;

        stopTimer();
        stopTracking();

        try {
            const res = await api.post(
                `/api/walks/${walkIdRef.current}/end`,
                { distanceKm, memo, poop }
            );

            const history = res.data.data;

            // 응답 확인
            console.log("End Walk Response:", history);

            // ✅ 복구용 저장
            sessionStorage.setItem("lastWalkResult", JSON.stringify(history));

            navigate("/walk/result", {
                state: history,
            });

            setStatus("FINISHED");
        } catch (err) {
            console.error("산책 종료 오류:", err);
        }
    };

    /* =====================
     * 언마운트 정리
     * ===================== */
    useEffect(() => {
        return () => {
            stopTimer();
            stopTracking();
        };
    }, []);

    /* =====================
     * 외부 노출
     * ===================== */
    return {
        status,
        path,
        seconds,
        distanceKm,
        avgSpeed,
        startWalk,
        endWalk,
    };
}
