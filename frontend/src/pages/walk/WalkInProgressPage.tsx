import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { endWalk, getWalkSession } from "../../api/walk";
import { calcDistanceKm } from "../../features/walk/utills/distance";

type Position = {
  lat: number;
  lng: number;
};

export default function WalkInProgressPage() {
  const navigate = useNavigate();

  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const [ending, setEnding] = useState(false);

  const lastPos = useRef<Position | null>(null);
  const watchId = useRef<number | null>(null);

  /* =========================
   * 세션 확인
   * ========================= */
  useEffect(() => {
    getWalkSession().then((res) => {
      const data = res.data.data;

      if (!data.walking) {
        navigate("/walk/start", { replace: true });
        return;
      }

      const start = new Date(data.startedAt);
      setStartedAt(start);
      setElapsedSec(
        Math.floor((Date.now() - start.getTime()) / 1000)
      );
    });
  }, [navigate]);

  /* =========================
   * 타이머
   * ========================= */
  useEffect(() => {
    if (!startedAt) return;

    const timer = setInterval(() => {
      setElapsedSec(
        Math.floor((Date.now() - startedAt.getTime()) / 1000)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [startedAt]);

  /* =========================
   * GPS 추적
   * ========================= */
  useEffect(() => {
    if (!navigator.geolocation) return;

    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const cur = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        if (lastPos.current) {
          const d = calcDistanceKm(
            lastPos.current.lat,
            lastPos.current.lng,
            cur.lat,
            cur.lng
          );
          setDistanceKm((prev) => prev + d);
        }

        lastPos.current = cur;
      },
      (err) => {
        console.error("GPS error", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  /* =========================
   * 산책 종료
   * ========================= */
  const handleEnd = async () => {
    if (ending) return;

    try {
      setEnding(true);
      await endWalk(Number(distanceKm.toFixed(2)));
      navigate("/walk/result", { replace: true });
    } catch (e) {
      alert("산책 종료에 실패했습니다.");
    } finally {
      setEnding(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>산책 중</h2>

      <div style={styles.card}>
        <div>
          <strong>경과 시간</strong>
          <div>{formatTime(elapsedSec)}</div>
        </div>

        <div>
          <strong>이동 거리</strong>
          <div>{distanceKm.toFixed(2)} km</div>
        </div>
      </div>

      <button
        onClick={handleEnd}
        disabled={ending}
        style={{
          ...styles.endButton,
          opacity: ending ? 0.6 : 1,
        }}
      >
        {ending ? "종료 중..." : "산책 종료"}
      </button>
    </div>
  );
}

/* =========================
 * utils
 * ========================= */
function formatTime(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  if (h > 0) {
    return `${h}:${pad(m)}:${pad(s)}`;
  }
  return `${m}:${pad(s)}`;
}

const pad = (n: number) => String(n).padStart(2, "0");

/* =========================
 * styles (임시)
 * ========================= */
const styles = {
  container: {
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column" as const,
    gap: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    background: "#f5f5f5",
  },
  endButton: {
    height: 52,
    borderRadius: 12,
    border: "none",
    fontSize: 16,
    fontWeight: 600,
    backgroundColor: "#e53935",
    color: "#fff",
    cursor: "pointer",
  },
};
