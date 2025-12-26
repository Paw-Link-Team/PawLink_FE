import { useState } from "react";
import WalkMap from "./WalkMap";
import { useWalkTracker } from "../../hooks/useWalkTracker";
import { formatTime } from "../../features/walk/utills/time";
import "./WalkPage.css";

type PoopStatus = "O" | "X";

export default function WalkPage() {
  const {
    status,
    path,
    seconds,
    distanceKm,
    avgSpeed,
    startWalk,
    endWalk,
  } = useWalkTracker();

  /* =====================
   * 산책 메모 상태
   * ===================== */
  const [memo, setMemo] = useState("");
  const [poop, setPoop] = useState<PoopStatus>("X");

  /* =====================
   * 산책 종료 (저장)
   * ===================== */
  const handleEnd = () => {
    endWalk(memo, poop);
  };

  return (
    <div className="walk-page">
      {/* 지도 */}
      <WalkMap path={path} />

      {/* 통계 */}
      <div className="walk-stats">
        <Stat label="산책 시간" value={formatTime(seconds)} />
        <Stat label="이동 거리" value={`${distanceKm.toFixed(2)} km`} />
        <Stat label="평균 속도" value={`${avgSpeed.toFixed(1)} km/h`} />
      </div>

      {/* 버튼 영역 */}
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

      {/* 산책 메모 */}
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

/* =====================
 * 공용 컴포넌트
 * ===================== */
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}