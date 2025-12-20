import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../../api/api";

export default function AuthProcessing() {
    const navigate = useNavigate();
useEffect(() => {
    const idToken = localStorage.getItem("idToken");
    console.log("idToken:", idToken);

    if (!idToken) {
        navigate("/login", { replace: true });
        return;
    }

    let cancelled = false;

    api.post("/auth/login", { idToken })
        .then((response) => {
            if (cancelled) return;

            console.log("RAW response:", response.data);

            const data = response.data?.data;
            if (!data) throw new Error("NO_DATA");

            if (data.isNewUser === true) {
                navigate("/signup/nickname", { replace: true });
                return;
            }

            if (!data.accessToken || !data.refreshToken) {
                throw new Error("NO_TOKEN");
            }

            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            navigate("/home", { replace: true });
        })
        .catch((error) => {
            console.error("login error:", error);
            navigate("/login", { replace: true });
        });

    return () => {
        cancelled = true;
    };
}, [navigate]);



    return <div>인증 처리 중...</div>;
}