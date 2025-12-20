import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OauthCallback() {
    const navigate = useNavigate();

   useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idToken = params.get("idToken");
    const error = params.get("error");

    console.log("PARSED:", { idToken, error });

    if (error) {
        alert("소셜 로그인에 실패했습니다.");
        navigate("/login", { replace: true });
        return;
    }

    // 🔑 StrictMode 2회 실행 방어
    if (!idToken) return;

    localStorage.setItem("idToken", idToken);
    navigate("/auth/processing", { replace: true });
}, [navigate]);
    return <div>소셜 로그인 처리 중...</div>;
}
