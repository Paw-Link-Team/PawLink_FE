import { useNavigate } from "react-router-dom";
import "./LoginScreenPage.css";

export default function LoginScreenPage() {
  const navigate = useNavigate();

  const goLogin = () => navigate("/login");

  return (
    <div className="login-screen-root">
      {/* 중앙 브랜드 영역 */}
      <main className="login-screen-center">
        <img
          src="/pawlink-logo.svg"
          alt="PawLink 로고"
          className="login-screen-logo-img"
        />

        <h2 className="login-screen-subtitle">
          산책을 기록하고,<br />
          약속을 나누다
        </h2>
      </main>

      {/* 하단 액션 영역 */}
      <footer className="login-screen-bottom">
        <button
          className="login-screen-login-btn"
          onClick={goLogin}
          aria-label="로그인하기"
        >
          로그인하기
        </button>
      </footer>
    </div>
  );
}
