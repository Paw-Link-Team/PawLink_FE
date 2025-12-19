import { useEffect, useMemo, useState } from "react";
import "./WalkLivePage.css";
// import NavBar from "../components/NavBar";

type WalkPhase = "before" | "walking" | "after";

export default function WalkLivePage() {
  const [phase, setPhase] = useState<WalkPhase>("before");

  // 산책 데이터(가짜)
  const [seconds, setSeconds] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0); // 이동거리
  const avgSpeed = useMemo(() => {
    if (seconds === 0) return 0;
    const hours = seconds / 3600;
    return distanceKm / hours; // km/h
  }, [seconds, distanceKm]);

  // ✅ 메모/배변 상태는 phase 바뀌어도 그대로 유지되게 별도 state로 둠
  const [memo, setMemo] = useState("");
  const [poop, setPoop] = useState<null | boolean>(null); // null=미선택, true=O, false=X

  // 산책중일 때만 타이머/거리 증가(가짜)
  useEffect(() => {
    if (phase !== "walking") return;

    const t = setInterval(() => {
      setSeconds((s) => s + 1);

      // 대충 1초마다 0.001~0.002km씩 움직이는 느낌(가짜)
      setDistanceKm((d) => +(d + 0.0011).toFixed(2));
    }, 1000);

    return () => clearInterval(t);
  }, [phase]);

  const timeText = formatTime(seconds);

  const onStart = () => {
    setPhase("walking");
  };

  const onEnd = () => {
    if (phase !== "walking") return; // ✅ 산책 중일 때만 종료 가능
    setPhase("after");
  };

  const onReset = () => {
    setPhase("before");
    setSeconds(0);
    setDistanceKm(0);
    // ✅ 메모/배변은 “후에도 남아있게”가 니 목표라서 리셋에서만 초기화할지 선택 가능
    // 여기서는 리셋하면 초기화하도록 해둘게 (원하면 주석 처리)
    setMemo("");
    setPoop(null);
  };

  return (
    <div className="wl-root">
      <div className="wl-phone">
        {/* 지도 영역(지금은 박스/이미지) */}
        <section className="wl-map">
          <div className="wl-map-pin">📍</div>
        </section>

        {/* 지표 3개 */}
        <section className="wl-metrics">
          <div className="wl-metric">
            <div className="wl-metric-label">산책시간</div>
            <div className={`wl-metric-value ${phase !== "before" ? "active" : ""}`}>
              {timeText}
            </div>
          </div>

          <div className="wl-metric">
            <div className="wl-metric-label">이동거리</div>
            <div className={`wl-metric-value ${phase !== "before" ? "active" : ""}`}>
              {distanceKm.toFixed(2)}km
            </div>
          </div>

          <div className="wl-metric">
            <div className="wl-metric-label">평균속도</div>
            <div className={`wl-metric-value ${phase !== "before" ? "active" : ""}`}>
              {avgSpeed.toFixed(1)}km/h
            </div>
          </div>
        </section>

        {/* 버튼 영역: 전/중/후 */}
        <section className="wl-actions">
          {phase === "before" && (
            <button className="wl-btn wl-btn-primary" onClick={onStart} type="button">
              산책 시작
            </button>
          )}

          {phase === "walking" && (
            <div className="wl-actions-row">
              <button className="wl-btn wl-btn-disabled" type="button" disabled>
                산책 시작
              </button>

              {/* ✅ 산책 중일 때만 활성 */}
              <button className="wl-btn wl-btn-primary" onClick={onEnd} type="button">
                산책 종료
              </button>
            </div>
          )}

          {phase === "after" && (
            <div className="wl-actions-row">
              <button className="wl-btn wl-btn-disabled" type="button" disabled>
                산책 시작
              </button>
              <button className="wl-btn wl-btn-disabled" type="button" disabled>
                산책 종료
              </button>
            </div>
          )}
        </section>

        {/* 메모/토글 */}
        <section className="wl-memo">
          <div className="wl-memo-title">산책 메모</div>

          <div className="wl-memo-row">
            <button className="wl-chip" type="button">
              📷 사진 추가하기
            </button>

            <button
              className={`wl-chip ${poop === false ? "active" : ""}`}
              type="button"
              onClick={() => setPoop(false)}
            >
              ● 배변 X
            </button>

            <button
              className={`wl-chip ${poop === true ? "active" : ""}`}
              type="button"
              onClick={() => setPoop(true)}
            >
              ● 배변 O
            </button>
          </div>

          <input
            className="wl-input"
            placeholder="산책 중 특이사항을 적어주세요."
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />

          {/* 디버그용(원하면 삭제) */}
          <div className="wl-debug">
            phase: {phase} / poop: {poop === null ? "미선택" : poop ? "O" : "X"}
            {phase === "after" && (
              <button className="wl-reset" onClick={onReset} type="button">
                리셋
              </button>
            )}
          </div>
        </section>

        {/* ✅ 공통 하단 네브 */}
        {/* <NavBar active="walk" /> */}

        <div className="wl-home-indicator" />
      </div>
    </div>
  );
}

function formatTime(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}
