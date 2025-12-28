import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export type WalkStatus = "BEFORE" | "WALKING" | "FINISHED";
export type PoopStatus = "O" | "X";

type LatLng = {
    lat: number;
    lng: number;
};

export function useWalkTracker() {
    const navigate = useNavigate();

    const [status, setStatus] = useState<WalkStatus>("BEFORE");
    const [path, setPath] = useState<LatLng[]>([]);
    const [seconds, setSeconds] = useState(0);
    const [distanceKm, setDistanceKm] = useState(0);
    const [avgSpeed, setAvgSpeed] = useState(0);

    const walkIdRef = useRef<number | null>(null);
    const timerRef = useRef<number | null>(null);
    const watchIdRef = useRef<number | null>(null);

    const calcDistanceKm = (a: LatLng, b: LatLng) => {
        const R = 6371;
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

                        if (dist < 0.005) return prev;

                        setDistanceKm((d) => {
                            const newDist = d + dist;

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

    const startWalk = async () => {
        try {
            const res = await api.post("/api/walks/start");
            walkIdRef.current = res.data.data.walkId;

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

            sessionStorage.setItem("lastWalkResult", JSON.stringify(history));

            navigate("/walk/result", {
                state: history,
            });

            setStatus("FINISHED");
        } catch (err) {
            console.error("산책 종료 오류:", err);
        }
    };

    useEffect(() => {
        return () => {
            stopTimer();
            stopTracking();
        };
    }, []);

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
