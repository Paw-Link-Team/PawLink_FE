import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { startWalk, getWalkSession } from "../../api/walk";

export default function WalkStartPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    // 이미 산책 중이면 바로 진행 화면으로
    getWalkSession()
      .then((res) => {
        const data = res.data.data;
        if (data.walking) {
          navigate("/walk/in-progress", { replace: true });
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleStart = async () => {
    if (starting) return;

    try {
      setStarting(true);
      await startWalk();
      navigate("/walk/in-progress");
    } catch (e) {
      alert("산책을 시작할 수 없습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 24 }}>산책 상태 확인 중...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>산책을 시작할까요?</h2>

      <button
        onClick={handleStart}
        disabled={starting}
        style={{
          ...styles.startButton,
          opacity: starting ? 0.6 : 1,
        }}
      >
        {starting ? "산책 시작 중..." : "산책 시작"}
      </button>
    </div>
  );
}

/* =========================
 * styles (임시)
 * ========================= */
const styles = {
  container: {
    padding: "32px 16px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 32,
  },
  startButton: {
    width: "100%",
    maxWidth: 320,
    height: 52,
    fontSize: 16,
    fontWeight: 600,
    borderRadius: 12,
    border: "none",
    backgroundColor: "#222",
    color: "#fff",
    cursor: "pointer",
  },
};
