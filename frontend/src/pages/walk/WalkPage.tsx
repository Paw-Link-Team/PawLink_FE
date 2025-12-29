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

  /* =====================
   * 서버 세션 (진실의 원천)
   * ===================== */
  const { loading, state, start, end } = useWalkSession();

  /* =====================
   * GPS / 타이머
   * ===================== */
  const tracker = useWalkTracker();

  const [memo, setMemo] = useState("");
  const [poop, setPoop] = useState<PoopStatus>("X");

  /* =====================
   * 세션 상태에 따라 트래커 제어
   * ===================== */
  useEffect(() => {
    if (state.status === "WALKING") {
      tracker.startTimer();
      tracker.startWatch();
    } else {
      tracker.reset();
    }
  }, [state.status]);

  /* =====================
   * 산책 종료
   * ===================== */
  const handleEnd = async () => {
    await end({
      distanceKm: tracker.distanceKm,
      memo,
      poop,
    });

    const durationSec = tracker.seconds;

    const avgSpeed =
      tracker.distanceKm > 0
        ? tracker.distanceKm / (durationSec / 3600)
        : 0;

    const endedAt = new Date();
    const startedAt = new Date(
      endedAt.getTime() - durationSec * 1000
    );

    const walkResult = {
      startedAt: startedAt.toISOString(),
      endedAt: endedAt.toISOString(),
      durationSec,
      distanceKm: tracker.distanceKm,
      avgSpeed,
      memo,
      poop,
    };

    sessionStorage.setItem(
      "lastWalkResult",
      JSON.stringify(walkResult)
    );

    navigate("/walk/result", {
      state: walkResult,
    });
  };


  if (loading) {
    return <div className="walk-page">로딩 중...</div>;
  }

  return (
    <div className="walk-page">
      <WalkMap path={tracker.path} />

      <div className="walk-stats">
        <Stat
          label="산책 시간"
          value={formatTime(tracker.seconds)}
        />
        <Stat
          label="이동 거리"
          value={`${tracker.distanceKm.toFixed(2)} km`}
        />
        <Stat
          label="평균 속도"
          value={`${tracker.avgSpeed.toFixed(1)} km/h`}
        />
      </div>

      <div className="walk-actions">
        {state.status === "IDLE" && (
          <button className="btn primary" onClick={start}>
            산책 시작
          </button>
        )}

        {state.status === "WALKING" && (
          <>
            <button className="btn disabled">
              산책 시작
            </button>
            <button
              className="btn primary"
              onClick={handleEnd}
            >
              산책 종료
            </button>
          </>
        )}
      </div>

      <div className="walk-memo">
        <div className="memo-title">산책 메모</div>

        <div className="memo-actions">
          <button className="memo-btn">📷 사진 추가하기</button>
          <button
            className={`memo-btn ${poop === "X" ? "active" : ""
              }`}
            onClick={() => setPoop("X")}
          >
            배변 X
          </button>
          <button
            className={`memo-btn ${poop === "O" ? "active" : ""
              }`}
            onClick={() => setPoop("O")}
          >
            배변 O
          </button>
        </div>

        <textarea
          placeholder="산책 중 특이사항을 적어주세요."
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          disabled={state.status === "IDLE"}
        />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
