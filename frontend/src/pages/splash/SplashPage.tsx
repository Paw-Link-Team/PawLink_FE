import "./SplashPage.css";
import api from "../../api/api";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      try {
        // 1️⃣ 서버 헬스 체크
        await api.get("/api/health", { timeout: 3000 });

        const hasToken =
          Boolean(localStorage.getItem("accessToken")) ||
          Boolean(localStorage.getItem("refreshToken"));

        // 2️⃣ 스플래시 연출용 딜레이
        setTimeout(() => {
          if (cancelled) return;

          if (hasToken) {
            // ✅ 역할 분기는 HomeRedirect에서
            navigate("/home", { replace: true });
          } else {
            navigate("/login/screen", { replace: true });
          }
        }, 1200);
      } catch {
        if (!cancelled) {
          navigate("/error/network", { replace: true });
        }
      }
    };

    boot();

    return () => {
      cancelled = true;
    };
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
