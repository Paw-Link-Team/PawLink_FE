import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { useMyPage } from "../../hooks/useMyPage";
import "./MyPage.css";

export default function MyPage() {
  const navigate = useNavigate();
  const {
    user,
    walkHistories,
    balance,
    loading,
  } = useMyPage();

  if (loading) {
    return <div className="mp-loading">로딩 중...</div>;
  }

  return (
    <div className="mp-wrapper">
      <div className="mp-screen">
        {/* Header */}
        <header className="mp-header">마이페이지</header>

        {/* =========================
         * User Summary
         * ========================= */}
        <section
          className="mp-profile-row"
          onClick={() => navigate("/mypage/profile")}
        >
          <div className="mp-profile-left">
            <div className="mp-avatar">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="프로필 이미지"
                  className="mp-avatar-img"
                />
              ) : (
                <svg
                  className="mp-paw-ico"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle cx="7.3" cy="8.4" r="2.0" />
                  <circle cx="12" cy="6.9" r="2.1" />
                  <circle cx="16.7" cy="8.4" r="2.0" />
                  <circle cx="19.1" cy="11.6" r="1.85" />
                  <path d="M6.2 16.4c0-3.0 2.9-5.3 5.8-5.3s5.8 2.3 5.8 5.3c0 2.5-2.2 4.6-5.8 4.6s-5.8-2.1-5.8-4.6z" />
                </svg>
              )}
            </div>

            <div className="mp-name">
              {user?.nickname ?? "사용자"}
            </div>
          </div>

          <div className="mp-chevron">›</div>
        </section>

        {/* =========================
         * Pay
         * ========================= */}
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
                className="mp-pill"
                onClick={() => navigate("/pay/charge")}
              >
                충전
              </button>
              <button
                className="mp-pill"
                onClick={() => navigate("/pay/withdraw")}
              >
                출금
              </button>
            </div>
          </div>
        </section>

        {/* =========================
         * My Walk
         * ========================= */}
        <section className="mp-section">
          <div className="mp-section-title">나의 산책</div>

          <button
            className="mp-row"
            onClick={() => navigate("/mypage/posts")}
          >
            <span className="mp-row-label">내가 올린 게시글</span>
            <span className="mp-chevron">›</span>
          </button>

          <button
            className="mp-row"
            onClick={() => navigate("/mypage/favorites")}
          >
            <span className="mp-row-label">관심 목록</span>
            <span className="mp-chevron">›</span>
          </button>
        </section>

        {/* =========================
         * Walk History Preview
         * ========================= */}
        <section className="mp-section">
          <div className="mp-section-title-row">
            <span className="mp-section-title">산책 히스토리</span>
            <button
              className="mp-more"
              onClick={() => navigate("/mypage/history")}
            >
              ›
            </button>
          </div>

          {walkHistories.length === 0 && (
            <div className="mp-empty">산책 기록이 없습니다</div>
          )}

          {walkHistories.slice(0, 3).map((w) => (
            <div key={w.id} className="mp-history-line">
              {w.date} / {w.distanceKm}km 산책 / 배변 {w.poop ? "O" : "X"}
            </div>
          ))}
        </section>

        <NavBar active="mypage" />
        <div className="mp-safe-pad" />
      </div>
    </div>
  );
}
