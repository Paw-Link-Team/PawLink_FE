import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "./Mypage.css";

type WalkHistoryItem = {
  id: number;
  date: string;
  distanceKm: string;
  poop: "O" | "X";
};

type PayMode = "charge" | "withdraw";

export default function Mypage() {
  const navigate = useNavigate();

  const WALK_HISTORY: WalkHistoryItem[] = useMemo(
    () => [
      { id: 1, date: "2025. 12. 5", distanceKm: "0.6", poop: "X" },
      { id: 2, date: "2025. 11. 23", distanceKm: "1.5", poop: "O" },
      { id: 3, date: "2025. 11. 10", distanceKm: "0.82", poop: "O" },
    ],
    []
  );

  const [balance, setBalance] = useState(0);
  const [payOpen, setPayOpen] = useState(false);
  const [payMode, setPayMode] = useState<PayMode>("charge");
  const [amount, setAmount] = useState("");

  const openPay = (mode: PayMode) => {
    setPayMode(mode);
    setAmount("");
    setPayOpen(true);
  };

  const closePay = () => {
    setPayOpen(false);
    setAmount("");
  };

  const submitPay = () => {
    const n = Number(amount.replaceAll(",", ""));
    if (!Number.isFinite(n) || n <= 0) return;

    if (payMode === "charge") setBalance((b) => b + n);
    if (payMode === "withdraw") setBalance((b) => Math.max(0, b - n));

    closePay();
  };

  const title = payMode === "charge" ? "충전" : "출금";
  const hint = payMode === "charge" ? "충전할 금액" : "출금할 금액";

  return (
    <div className="mp-wrapper">
      <div className="mp-screen">
        <div className="mp-status" />

        <header className="mp-header">마이페이지</header>

        <section className="mp-profile-row" onClick={() => navigate("/parent-profile")}>
          <div className="mp-profile-left">
            <div className="mp-avatar">👤</div>
            <div className="mp-name">강형욱</div>
          </div>
          <div className="mp-chevron">›</div>
        </section>

        <section className="mp-pay-card">
          <div className="mp-pay-left">
            <div className="mp-pay-title">PawLink pay</div>
          </div>

          <div className="mp-pay-right">
            <div className="mp-pay-amount">
              <span className="mp-pay-num">{balance.toLocaleString("ko-KR")}</span>
              <span className="mp-pay-won">원</span>
            </div>

            <div className="mp-pay-actions">
              <button className="mp-pill" onClick={() => openPay("charge")}>
                충전
              </button>
              <button className="mp-pill" onClick={() => openPay("withdraw")}>
                출금
              </button>
            </div>
          </div>
        </section>

        <section className="mp-section">
          <div className="mp-section-title">나의 산책</div>

          <button className="mp-row" onClick={() => navigate("/mypage/posts")}>
            <span className="mp-row-label">내가 올린 게시글</span>
            <span className="mp-chevron">›</span>
          </button>

          <button className="mp-row" onClick={() => navigate("/mypage/favorites")}>
            <span className="mp-row-label">관심 목록</span>
            <span className="mp-chevron">›</span>
          </button>
        </section>

        <section className="mp-section">
          <div className="mp-section-title">산책 히스토리</div>

          {WALK_HISTORY.map((w) => (
            <button
              key={w.id}
              className="mp-row"
              onClick={() => navigate(`/mypage/history/${w.id}`)}
            >
              <span className="mp-row-label">
                {w.date} / {w.distanceKm} km 산책/배변 {w.poop}
              </span>
              <span className="mp-chevron">›</span>
            </button>
          ))}
        </section>

        {/* ✅ Pay Modal (Figma 느낌 바텀시트) */}
        {payOpen && (
          <div className="mp-modal-dim" onClick={closePay}>
            <div className="mp-modal" onClick={(e) => e.stopPropagation()}>
              <div className="mp-modal-handle" />

              <div className="mp-modal-head">
                <div className="mp-modal-title">{title}</div>
                <button className="mp-x" onClick={closePay} aria-label="close">
                  ✕
                </button>
              </div>

              <div className="mp-modal-sub">
                현재 잔액 <strong>{balance.toLocaleString("ko-KR")}원</strong>
              </div>

              <div className="mp-amount-box">
                <label className="mp-amount-label">{hint}</label>
                <div className="mp-amount-input">
                  <input
                    value={amount}
                    inputMode="numeric"
                    placeholder="0"
                    onChange={(e) => {
                      const only = e.target.value.replace(/[^\d]/g, "");
                      const withComma =
                        only.length === 0 ? "" : Number(only).toLocaleString("ko-KR");
                      setAmount(withComma);
                    }}
                  />
                  <span className="mp-amount-won">원</span>
                </div>
              </div>

              <div className="mp-quick">
                {[1000, 3000, 5000, 10000].map((v) => (
                  <button
                    key={v}
                    className="mp-quick-btn"
                    onClick={() => {
                      const cur = Number(amount.replaceAll(",", "")) || 0;
                      const next = cur + v;
                      setAmount(next.toLocaleString("ko-KR"));
                    }}
                  >
                    +{v.toLocaleString("ko-KR")}
                  </button>
                ))}
              </div>

              <button className="mp-submit" onClick={submitPay}>
                {title}하기
              </button>
            </div>
          </div>
        )}

        <NavBar active="mypage" />
        <div className="mp-safe-pad" />
      </div>
    </div>
  );
}
