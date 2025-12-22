import "./SplashPage.css";
import api from "../../api/api";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";



export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkNetwork = async () => {
      try {
        await api.get("/api/health", { timeout: 3000 });

        const token = localStorage.getItem("refreshToken");

        setTimeout(() => {
          if (token) {
            navigate("/home", { replace: true });
          } else {
            navigate("/login/screen", { replace: true });
          }
        }, 1200);

      } catch (error) {
        navigate("/error/network", { replace: true });
      }
    };
    
    checkNetwork();
  }, [navigate]);
  

  return (
    <div className="splash-root">
        <img
          src="/pawlink-logo.svg"
          alt="PawLink 로고"
          className="splash-img"
        />
    </div>
  );
}
