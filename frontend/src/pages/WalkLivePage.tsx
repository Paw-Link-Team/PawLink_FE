// frontend/src/pages/WalkLivePage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WalkLivePage.css";

// ✅ 에셋 import (Vite에서 가장 안정적)
import doneIcon from "../assets/walk-done-icon.png";
import congratsIllu from "../assets/walk-congrats-illu.png";
import congratsBg from "../assets/walk-congrats-bg.png";

type WalkPhase = "before" | "walking" | "after";
type ResultStep = null | "done" | "congrats";

export default function WalkLivePage() {
  const navigate = useNavigate();

  const [phase, setPhase] = useState<WalkPhase>("before");

  // 산책 데이터(가짜)
  const [seconds, setSeconds] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const avgSpeed = useMemo(() => {
    if (seconds === 0) return 0;
    const hours = seconds / 3600;
    return distanceKm / hours;
  }, [seconds, distanceKm]);

  // 메모/배변 상태
  const [memo, setMemo] = useState("");
  const [poop, setPoop] = useState<null | boolean>(null);

  // 저장 후 결과 화면 단계
  const [resultStep, setResultStep] = useState<ResultStep>(null);

  // 산책중일 때만 타이머/거리 증가(가짜)
  useEffect(() => {
    if (phase !== "walking") return;

    const t = window.setInterval(() => {
      setSeconds((s) => s + 1);
      setDistanceKm((d) => +(d + 0.0011).toFixed(2));
    }, 1000);

    return () => window.clearInterval(t);
  }, [phase]);

  // 1번 화면에서 3초 뒤 2번 화면으로 자동 전환
  useEffect(() => {
    if (resultStep !== "done") return;
    const t = window.setTimeout(() => setResultStep("congrats"), 3000);
    return () => window.clearTimeout(t);
  }, [resultStep]);

  const timeText = formatTime(seconds);

  const onStart = () => setPhase("walking");

  const onEnd = () => {
    if (phase !== "walking") return;
    setPhase("after");
  };

  const onReset = () => {
    setPhase("before");
    setSeconds(0);
    setDistanceKm(0);
    setMemo("");
    setPoop(null);
    setResultStep(null);
  };

  // 저장 가능 조건: 산책 종료 + 메모 작성 + 배변 선택
  const canSave = phase === "after" && memo.trim().length > 0 && poop !== null;

  const onSave = () => {
    if (!canSave) return;

    console.log("SAVE", { phase, seconds, distanceKm, avgSpeed, memo, poop });

    // ✅ 저장 후 1번 완료 화면 표시
    setResultStep("done");
  };

  const closeResult = () => {
    navigate(-1);
  };

  const finishResult = () => {
    navigate("/home");
  };

  const showOverlay = resultStep !== null;

  return (
    <div className="wl-root">
      <div className={`wl-phone ${showOverlay ? "is-overlay" : ""}`}>
        {/* =======================
            메인 WalkLive 화면
           ======================= */}
        {!showOverlay && (
          <>
            <section className="wl-map">
              <button
                className="wl-back-btn"
                type="button"
                aria-label="back"
                onClick={() => navigate(-1)}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 6l-6 6 6 6"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="wl-map-pin">📍</div>
            </section>

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

              {/* 디버그(원하면 삭제) */}
              <div className="wl-debug">
                phase: {phase} / poop: {poop === null ? "미선택" : poop ? "O" : "X"}
                {phase === "after" && (
                  <button className="wl-reset" onClick={onReset} type="button">
                    리셋
                  </button>
                )}
              </div>
            </section>

            <div className="wl-save-wrap">
              <button
                className={`wl-save-btn ${canSave ? "active" : ""}`}
                type="button"
                onClick={onSave}
                disabled={!canSave}
              >
                저장
              </button>
            </div>

            <div className="wl-home-indicator" />
          </>
        )}

        {/* =======================
            저장 후 결과 화면(오버레이)
           ======================= */}
        {showOverlay && (
          <section className="wl-result">
            <button
              className="wl-result-close"
              type="button"
              aria-label="close"
              onClick={closeResult}
            >
              ✕
            </button>

            {/* ✅ 1번 화면: 아이콘 PNG로 정확히 */}
            {resultStep === "done" && (
              <div className="wl-result-body">
                <div className="wl-done-icon-wrap">
                  <img className="wl-done-icon" src={doneIcon} alt="산책 완료" />
                </div>

                <div className="wl-result-title">
                  <b>강형욱님과의</b>
                  <br />
                  <b>산책이 완료되었습니다!</b>
                </div>

                <div className="wl-result-metrics">
                  <Row label="산책 시간" value={timeText} />
                  <Row label="이동 거리" value={`${distanceKm.toFixed(2)}km`} />
                  <Row label="평균 속도" value={`${avgSpeed.toFixed(1)}km/h`} />
                </div>

                <div className="wl-result-footer">
                  <button className="wl-result-btn" type="button" onClick={finishResult}>
                    완료
                  </button>
                </div>
              </div>
            )}

            {/* ✅ 2번 화면: 배경(confetti) + 일러스트 PNG 정확히 */}
            {resultStep === "congrats" && (
              <div className="wl-result-body">
                <div
                  className="wl-congrats-hero"
                  style={{ backgroundImage: `url(${congratsBg})` }}
                >
                  <img className="wl-congrats-illu" src={congratsIllu} alt="축하 일러스트" />
                </div>

                <div className="wl-result-title2">
                  <b>축하드립니다</b>
                  <br />
                  <b>첫 산책을 완료했어요</b>
                </div>

                <div className="wl-result-metrics">
                  <Row label="산책 시간" value={timeText} />
                  <Row label="이동 거리" value={`${distanceKm.toFixed(2)}km`} />
                  <Row label="평균 속도" value={`${avgSpeed.toFixed(1)}km/h`} />
                </div>

                <div className="wl-result-footer">
                  <button className="wl-result-btn" type="button" onClick={finishResult}>
                    완료
                  </button>
                </div>
              </div>
            )}

            <div className="wl-home-indicator" />
          </section>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="wl-result-row">
      <div className="wl-result-label">{label}</div>
      <div className="wl-result-value">{value}</div>
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
