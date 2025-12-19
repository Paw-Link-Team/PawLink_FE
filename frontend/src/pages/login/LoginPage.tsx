import { useEffect } from "react";
import Header from "../../components/Header/Header";
import kakaoLogin from "../../assets/login/kakao.png";
import naverLogin from "../../assets/login/naver.png";
import "./LoginPage.css";

export default function LoginPage() {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  const handleKakaoLogin = () => {
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_KAKAO_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
      response_type: "code",
    });

    window.location.href =
      `${import.meta.env.VITE_KAKAO_LOGIN_URL}?${params.toString()}`;
  };

  const handleNaverLogin = () => {
    const state = crypto.randomUUID();

    const params = new URLSearchParams({
      response_type: "code",
      client_id: import.meta.env.VITE_NAVER_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_NAVER_REDIRECT_URI,
      state,
    });

    window.location.href =
      `${import.meta.env.VITE_NAVER_LOGIN_URL}?${params.toString()}`;
  };

  return (
     <>
      <Header title="로그인" />

      <main className="page-content">
        <section className="login-page">
          <div className="login-inner">
            <div className="login-hero">
              <div className="hero-icon">🐾</div>
              <h2>PawLink에 오신 걸 환영해요</h2>
              <p>
                간편한 소셜 로그인으로<br />
                바로 시작해보세요
              </p>
            </div>

            <div className="login-actions">
              <button className="social-btn" onClick={handleKakaoLogin}>
                <img src={kakaoLogin} alt="카카오 로그인" />
              </button>

              <button className="social-btn" onClick={handleNaverLogin}>
                <img src={naverLogin} alt="네이버 로그인" />
              </button>

              <p className="login-hint">
                로그인과 동시에 회원가입이 진행돼요
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
