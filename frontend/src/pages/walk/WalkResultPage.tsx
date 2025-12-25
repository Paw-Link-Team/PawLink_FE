import { useLocation, useNavigate } from "react-router-dom";

type ResultState = {
  distanceKm: number;
  elapsedSec: number;
};

export default function WalkResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ResultState | null;

  // 새로고침 / 직접 접근 방지
  if (!state) {
    navigate("/home", { replace: true });
    return null;
  }

  const { distanceKm, elapsedSec } = state;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>산책 완료 🎉</h2>

      <div style={styles.card}>
        <div>
          <strong>이동 거리</strong>
          <div>{distanceKm.toFixed(2)} km</div>
        </div>

        <div>
          <strong>산책 시간</strong>
          <div>{formatTime(elapsedSec)}</div>
        </div>
      </div>

      <p style={styles.desc}>
        오늘도 건강한 산책을 완료했어요!
      </p>

      <div style={styles.actions}>
        <button
          style={styles.primaryBtn}
          onClick={() => navigate("/home")}
        >
          홈으로
        </button>

        <button
          style={styles.secondaryBtn}
          onClick={() => navigate("/mypage")}
        >
          산책 기록 보기
        </button>
      </div>
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

  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
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
    fontSize: 22,
    fontWeight: 700,
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 12,
    background: "#f5f5f5",
  },
  desc: {
    fontSize: 14,
    color: "#555",
  },
  actions: {
    display: "flex",
    gap: 12,
  },
  primaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    border: "none",
    backgroundColor: "#222",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  secondaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
};
