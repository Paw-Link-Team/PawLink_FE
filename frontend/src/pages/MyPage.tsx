import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "./MyPage.css";

type WalkHistoryItem = {
  id: number;
  date: string;
  distanceKm: string;
  poop: "O" | "X";
};

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

  const [balance] = useState(0);

  return (
    <div className="mp-wrapper">
      <div className="mp-screen">
        <div className="mp-status" />

        <header className="mp-header">마이페이지</header>

        {/* 프로필 */}
        <section
          className="mp-profile-row"
          onClick={() => navigate("/mypage/profile")}
        >
          <div className="mp-profile-left">
            <div className="mp-avatar">
              <svg className="mp-paw-ico" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="7.3" cy="8.4" r="2.0" />
                <circle cx="12" cy="6.9" r="2.1" />
                <circle cx="16.7" cy="8.4" r="2.0" />
                <circle cx="19.1" cy="11.6" r="1.85" />
                <path d="M6.2 16.4c0-3.0 2.9-5.3 5.8-5.3s5.8 2.3 5.8 5.3c0 2.5-2.2 4.6-5.8 4.6s-5.8-2.1-5.8-4.6z" />
              </svg>
            </div>

            <div className="mp-name">강형욱</div>
          </div>
          <div className="mp-chevron">›</div>
        </section>

        {/* PawLink Pay */}
        <section className="mp-pay-card">
          <div className="mp-pay-left">
            <div className="mp-pay-title">PawLink pay</div>
          </div>

          <div className="mp-pay-right">
            <div className="mp-pay-amount">
              <span className="mp-pay-num">
                {balance.toLocaleString("ko-KR")}
              </span>
              <span className="mp-pay-won">원</span>
            </div>

            <div className="mp-pay-actions">
              <button
                type="button"
                className="mp-pill"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate("/pay/charge");
                }}
              >
                충전
              </button>

              <button
                type="button"
                className="mp-pill"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate("/pay/withdraw");
                }}
              >
                출금
              </button>
            </div>
          </div>
        </section>

        {/* 나의 산책 */}
        <section className="mp-section">
          <div className="mp-section-title">나의 산책</div>

          <button
            type="button"
            className="mp-row"
            onClick={() => navigate("/mypage/posts")}
          >
            <span className="mp-row-label">내가 올린 게시글</span>
            <span className="mp-chevron">›</span>
          </button>

          <button
            type="button"
            className="mp-row"
            onClick={() => navigate("/mypage/favorites")}
          >
            <span className="mp-row-label">관심 목록</span>
            <span className="mp-chevron">›</span>
          </button>
        </section>

        {/* =========================
            ✅ 산책 히스토리 (1번 요구사항)
            - 제목 줄만 이동 가능 ("산책 히스토리 >")
            - 아래 날짜 리스트는 화살표 제거
           ========================= */}
        <section className="mp-section">
          <button
            type="button"
            className="mp-row mp-history-head"
            onClick={() => navigate("/mypage/history")}
          >
            <span className="mp-section-title mp-history-title">
              산책 히스토리
            </span>
            <span className="mp-chevron">›</span>
          </button>

          {WALK_HISTORY.map((w) => (
            <div key={w.id} className="mp-row mp-history-item">
              <span className="mp-row-label">
                {w.date} / {w.distanceKm} km 산책/배변 {w.poop}
              </span>
            </div>
          ))}
        </section>

        <NavBar active="mypage" />
        <div className="mp-safe-pad" />
      </div>
    </div>
  );
}
