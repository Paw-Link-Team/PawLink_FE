import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WalkMap from "./WalkMap";
import { useWalkTracker } from "../../hooks/useWalkTracker";
import { useWalkSession } from "../../hooks/useWalkSession";
import { formatTime } from "../../features/walk/utills/time";
import "./WalkPage.css";

type PoopStatus = "O" | "X";

export default function WalkPage() {
  const navigate = useNavigate();

  const { loading, walking, startedAt } = useWalkSession();
  const {
    status,
    path,
    seconds,
    distanceKm,
    avgSpeed,
    startWalk,
    restoreWalk,
    endWalk,
  } = useWalkTracker();

  const [memo, setMemo] = useState("");
  const [poop, setPoop] = useState<PoopStatus>("X");

  /* =====================
   * 서버 기준 복구
   * ===================== */
  useEffect(() => {
    if (loading) return;
    if (walking && startedAt) {
      restoreWalk(startedAt);
    }
  }, [loading, walking, startedAt]);

  /* =====================
   * 종료
   * ===================== */
  const handleEnd = async () => {
    const result = await endWalk(memo, poop);
    navigate("/walk/result", {
      state: { walkHistoryId: result.id },
    });
  };

  return (
    <div className="walk-page">
      <WalkMap path={path} />

      <div className="walk-stats">
        <Stat label="산책 시간" value={formatTime(seconds)} />
        <Stat label="이동 거리" value={`${distanceKm.toFixed(2)} km`} />
        <Stat label="평균 속도" value={`${avgSpeed.toFixed(1)} km/h`} />
      </div>

      <div className="walk-actions">
        {status === "BEFORE" && (
          <button className="btn primary" onClick={startWalk}>
            산책 시작
          </button>
        )}

        {status === "WALKING" && (
          <>
            <button className="btn disabled">산책 시작</button>
            <button className="btn primary" onClick={handleEnd}>
              산책 종료
            </button>
          </>
        )}

        {status === "FINISHED" && (
          <>
            <button className="btn disabled">산책 시작</button>
            <button className="btn disabled">산책 종료</button>
          </>
        )}
      </div>

      <div className="walk-memo">
        <div className="memo-title">산책 메모</div>

        <div className="memo-actions">
          <button className="memo-btn">📷 사진 추가하기</button>
          <button
            className={`memo-btn ${poop === "X" ? "active" : ""}`}
            onClick={() => setPoop("X")}
          >
            배변 X
          </button>
          <button
            className={`memo-btn ${poop === "O" ? "active" : ""}`}
            onClick={() => setPoop("O")}
          >
            배변 O
          </button>
        </div>

        <textarea
          placeholder="산책 중 특이사항을 적어주세요."
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          disabled={status === "BEFORE"}
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}