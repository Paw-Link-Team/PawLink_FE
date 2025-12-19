import { useNavigate } from "react-router-dom";
import kakaoLogin from "../../assets/login/ko/kakao_login_medium_narrow.png";
import naverLogin from "../../assets/login/NAVER_login_KR/NAVER_login_Dark_KR_green_wide_H48.png";

export default function MyPageGuest() {
  const navigate = useNavigate();

  /** 공통 로그인 처리 (provider별 OAuth → idToken → /auth/login) */
  const loginWithProvider = async (provider: "NAVER" | "KAKAO") => {
    try {
      console.log(`🔥 ${provider} 로그인 시작`);

      // 1️⃣ 서버 OAuth 호출 → idToken 받기
      const oauthRes = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/oauth/${provider.toLowerCase()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!oauthRes.ok) {
        throw new Error(`${provider} OAuth 실패`);
      }

      const oauthResult = await oauthRes.json();
      console.log(`${provider} OAUTH RESULT:`, oauthResult);

      const idToken = oauthResult?.data?.idToken;
      if (!idToken) {
        throw new Error(`${provider} idToken 없음`);
      }

      // 2️⃣ 우리 서버 로그인 API 호출
      const loginRes = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken,
            provider, // 서버가 provider를 요구하면 전달
          }),
        }
      );

      if (!loginRes.ok) {
        throw new Error("로그인 API 실패");
      }

      const loginResult = await loginRes.json();
      console.log("LOGIN RESULT:", loginResult);

      const { accessToken, refreshToken, isNewUser } = loginResult.data;

      // 3️⃣ 토큰 저장 (idToken 저장 ❌)
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // 4️⃣ 분기 (지금은 마이페이지로)
      // if (isNewUser) navigate("/onboarding");
      // else navigate("/mypage");
      navigate("/mypage");
    } catch (e) {
      console.error(`${provider} 로그인 실패`, e);
      alert("로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  const handleNaverLogin = () => loginWithProvider("NAVER");
  const handleKakaoLogin = () => loginWithProvider("KAKAO");

  return (
    <section className="mypage-guest">
      <div className="icon">🐾</div>

      <h2>로그인이 필요해요</h2>
      <p className="desc">
        산책 기록을 저장하고 관리하려면<br />
        로그인 또는 회원가입이 필요해요
      </p>

      <div className="social-login">
        <button className="social-btn" onClick={handleKakaoLogin}>
          <img src={kakaoLogin} alt="카카오 로그인" />
        </button>

        <button className="social-btn" onClick={handleNaverLogin}>
          <img src={naverLogin} alt="네이버 로그인" />
        </button>
      </div>

      <div className="benefits">
        <p>로그인 하면 이런걸 할 수 있어요</p>
        <ul>
          <li>🐾 산책 히스토리 자동 저장</li>
          <li>🐶 내가 걸은 산책거리 관리</li>
          <li>⭐ 관심 산책 기록 둘러보기</li>
        </ul>
      </div>
    </section>
  );
}
