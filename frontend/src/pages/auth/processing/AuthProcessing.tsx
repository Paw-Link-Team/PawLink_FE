import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AuthProcessing() {
    const navigate = useNavigate();

    useEffect(() => {
        const idToken = localStorage.getItem("idToken");
        if (!idToken) {
            navigate("/login", { replace: true });
            return;
        }

        let cancelled = false;

        axios.post("/auth/login", { idToken })
            .then((response) => {
                if (cancelled) return;

                if (response.data.isNewUser) {
                    navigate("/signup/nickname", { replace: true });
                } else {
                    const { accessToken, refreshToken } = response.data;
                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", refreshToken);
                    navigate("/home", { replace: true });
                }
            });

        return () => {
            cancelled = true;
        };
    }, [navigate]);

    return <div>인증 처리 중...</div>;
}