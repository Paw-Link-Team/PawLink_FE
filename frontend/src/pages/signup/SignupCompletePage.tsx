import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Brand";
import "./SignupCompetePage.css";

export default function SignupCompletePage() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/home");
  };

  return (
    <div className="complete-root">
      <Header variant="brand" />

      <div className="complete-card">
        <div className="complete-center">
          <div className="welcome-visual">
            <img src="/image 30.svg" alt="" className="confetti" />
            <img src="/image 29.svg" alt="welcome dog" className="welcome-dog" />
          </div>

          <p className="welcome-message">
            <strong>PawLink</strong>에 가입해주셔서 감사합니다!
            <br />
            지금부터 서비스를 즐겨주세요 🐾
          </p>
        </div>

        <button className="complete-button" onClick={goHome}>
          시작하기
        </button>
      </div>
    </div>
  );
}
