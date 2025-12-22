import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";

export default function AuthProcessing() {
    const navigate = useNavigate();
    const executedRef = useRef(false);

    useEffect(() => {
        if (executedRef.current) return;
        executedRef.current = true;

        const idToken = localStorage.getItem("idToken");

        if (!idToken) {
            navigate("/login", { replace: true });
            return;
        }

        api.post("/auth/login", { idToken })
            .then((response) => {
                const data = response.data?.data;
                console.log("LOGIN RESPONSE:", data);
                if (!data) throw new Error("NO_DATA");

                // 🔑 온보딩 필요
                if (data.newUser === true) {
                    navigate("/signup/agreement", { replace: true });
                    return;
                }

                // 🔑 정상 로그인
                if (!data.accessToken || !data.refreshToken) {
                    throw new Error("NO_TOKEN");
                }

                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);

                // ✅ 기존 유저는 idToken 더 이상 필요 없음
                localStorage.removeItem("idToken");

                navigate("/home", { replace: true });
            })
            .catch((error) => {
                console.error("auth error:", error);

                // ❌ 인증 실패 → idToken도 제거
                localStorage.removeItem("idToken");

                navigate("/login", { replace: true });
            });
    }, [navigate]);

    return (
    <div className="auth-processing">
      <div className="auth-box">
        <div className="brand">PawLink</div>

        <div className="spinner" />

        <p className="message">인증 처리 중입니다</p>
      </div>
    </div>
  );
}
