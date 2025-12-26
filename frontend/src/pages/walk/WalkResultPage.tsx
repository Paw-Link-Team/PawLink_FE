import { useLocation, useNavigate } from "react-router-dom";
import { formatTime } from "../../features/walk/utills/time";
import "./WalkResultPage.css";

type WalkHistory = {
  startedAt: string;
  endedAt: string;
  durationSec: number;
  distanceKm: number;
  avgSpeed: number;
  memo?: string;
  poop: "O" | "X";
};

export default function WalkResultPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ state 우선, 없으면 sessionStorage에서 복구
  const data: WalkHistory | null =
    (location.state as WalkHistory | null) ??
    JSON.parse(
      sessionStorage.getItem("lastWalkResult") || "null"
    );

  if (!data) {
    return (
      <div className="walk-result empty">
        <p>잘못된 접근입니다.</p>
        <button onClick={() => navigate("/mypage")}>
          마이페이지로
        </button>
      </div>
    );
  }

  return (
    <div className="walk-result">
      <div className="result-header">
        <div className="icon">🐾</div>
        <h2>산책이 완료되었습니다</h2>
      </div>

      <div className="result-card">
        <ResultRow
          label="산책 시간"
          value={formatTime(data.durationSec)}
        />
        <ResultRow
          label="이동 거리"
          value={`${data.distanceKm.toFixed(2)} km`}
        />
        <ResultRow
          label="평균 속도"
          value={`${data.avgSpeed.toFixed(1)} km/h`}
        />
        <ResultRow
          label="배변 여부"
          value={data.poop === "O" ? "있음" : "없음"}
        />
      </div>

      {data.memo && (
        <div className="memo-card">
          <div className="memo-title">산책 메모</div>
          <div className="memo-content">{data.memo}</div>
        </div>
      )}

      <button
        className="result-btn"
        onClick={() => {
          // ✅ 완료 시 정리
          sessionStorage.removeItem("lastWalkResult");
          navigate("/mypage");
        }}
      >
        완료
      </button>
    </div>
  );
}

function ResultRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="result-row">
      <span className="label">{label}</span>
      <span className="value">{value}</span>
    </div>
  );
}
