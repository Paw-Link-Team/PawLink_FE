import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

type ApiResponse<T> = {
  success: boolean;
  status: string;
  code: number;
  message: string;
  data: T;
};

type MeResponse = {
  userId: number;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  type: "OWNER" | "WALKER" | "ADMIN";
};

export default function HomeRedirect() {
  const navigate = useNavigate();
  const ranOnce = useRef(false);

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    const redirect = async () => {
      try {
        console.log("🔥 HomeRedirect mounted");

        const res = await api.get<ApiResponse<MeResponse>>("/mypage/info");

        console.log("응답 data:", res.data.data);

        const role = res.data.data.role;
        console.log("사용자 역할:", role);

        if (role === "ADMIN" || role === "SUPER_ADMIN") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/home/main", { replace: true });
        }
      } catch (err) {
        console.error("❌ HomeRedirect 실패", err);
        navigate("/login/screen", { replace: true });
      }
    };

    redirect();
  }, [navigate]);

  return null;
}
