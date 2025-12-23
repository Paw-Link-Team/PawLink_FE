import NavBar from "../../components/NavBar";
import { useMyPage } from "../../hooks/useMyPage";
import { useNavigate } from "react-router-dom";
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
        <header className="mp-header">
          {"마이페이지"}
        </header>

        {/* 사용자 */}
        <section
          className="mp-profile-row"
          onClick={() => navigate("/mypage/profile")}
        >
          <div className="mp-profile-left">
            <div className="mp-avatar">
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} className="mp-avatar-img" />
              ) : (
                <div className="mp-avatar-placeholder" />
              )}
            </div>
            <div className="mp-name">
              {user?.nickname ?? "사용자"}
            </div>
          </div>
          <div className="mp-chevron">›</div>
        </section>

        {/* Pay */}
        <section className="mp-pay-card">
          <div className="mp-pay-title">PawLink pay</div>
          <div className="mp-pay-amount">
            {balance.toLocaleString("ko-KR")}원
          </div>
          <div className="mp-pay-actions">

            <button
              className="mp-pill"
              onClick={() => navigate("/pay/charge")}
            >
              충전
            </button>

            <button
              className="mp-pill mp-disabled"
              onClick={() => alert("출금 기능은 준비 중입니다")}
            >
              출금
            </button>
          </div>

        </section>
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
        {/* 산책 히스토리 */}
        <section className="mp-section">
          <div className="mp-section-title">산책 히스토리</div>

          {walkHistories.length === 0 && (
            <div className="mp-empty">산책 기록이 없습니다</div>
          )}

          {walkHistories.map((w) => (
            <button
              key={w.id}
              className="mp-row"
              onClick={() => navigate(`/mypage/history/${w.id}`)}
            >
              {w.date} / {w.distanceKm}km / 배변 {w.poop ? "O" : "X"}
            </button>
          ))}
        </section>

        <NavBar active="mypage" />
      </div>
    </div>
  );
}
