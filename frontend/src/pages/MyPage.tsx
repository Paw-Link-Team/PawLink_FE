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

  // ✅ 잔액은 일단 로컬 상태로 유지 (충전 페이지에서 나중에 연동 가능)
  const [balance] = useState(0);

  return (
    <div className="mp-wrapper">
      <div className="mp-screen">
        <div className="mp-status" />

        <header className="mp-header">마이페이지</header>

        {/* ✅ 마이프로필로 가고 싶으면 /mypage/profile로 바꿔도 됨 */}
        <section
          className="mp-profile-row"
          onClick={() => navigate("/mypage/profile")}
        >
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

            {/* ✅ 모달 삭제하고 페이지 이동으로 변경 */}
            <div className="mp-pay-actions">
              <button
                type="button"
                className="mp-pill"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation(); // ✅ 부모 클릭 전파 차단
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
                  e.stopPropagation(); // ✅ 부모 클릭 전파 차단
                  navigate("/pay/withdraw");
                }}
              >
                출금
              </button>
            </div>
          </div>
        </section>

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

        <section className="mp-section">
          <div className="mp-section-title">산책 히스토리</div>

          {WALK_HISTORY.map((w) => (
            <button
              key={w.id}
              type="button"
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

        <NavBar active="mypage" />
        <div className="mp-safe-pad" />
      </div>
    </div>
  );
}
