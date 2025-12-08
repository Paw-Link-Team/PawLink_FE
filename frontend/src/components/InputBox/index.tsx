import kakao_logo from '../../images/kakao_login_medium_wide.png';

const client_id: string = "04c6f586a4b6d73386bf58ed25063cce";
const redirect_uri: string = "http://localhost:8080/api/auth/callback/kakao";

const KAKAO_AUTH_URL =
  `https://kauth.kakao.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`;

const KakaoLoginButton = () => {
  const handleClick = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <button className="input-box-button" type="button" onClick={handleClick}>
      <img src={kakao_logo} alt="카카오톡 로그인" />
    </button>
  );
};

export default KakaoLoginButton;
