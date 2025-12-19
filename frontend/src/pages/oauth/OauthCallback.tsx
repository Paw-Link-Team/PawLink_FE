import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OauthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        console.log("FULL URL:", window.location.href);
        console.log("SEARCH:", window.location.search);

        const params = new URLSearchParams(window.location.search);
        const idToken = params.get("idToken");
        const error = params.get("error");

        console.log("PARSED:", { idToken, error });
        if (error) {
            handleOauthError(error);
            navigate("/login");
            return;
        }

        if (!idToken) {
            return;
        }

        localStorage.setItem("idToken", idToken);

        navigate("/auth/processing");
    }, [navigate]);
    return <div>OAuth Callback 처리 중...</div>;
}

function handleOauthError(error: string) {
    switch (error) {
        case "OAUTH_FAILED":
            alert("소셜 로그인에 실패했습니다.");
            break;
        case "INVALID_PROVIDER":
            alert("지원하지 않는 로그인 방식입니다.");
            break;
        default:
            alert("로그인 중 오류가 발생했습니다.");
    }
}