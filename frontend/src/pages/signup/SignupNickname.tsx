import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../..//api/api"; 

type UserType = "OWNER" | "WALKER";

export default function SignupNickname() {
  const [nickname, setNickname] = useState("");
  const [type, setType] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    if (!type) {
      alert("역할을 선택해주세요.");
      return;
    }

    const idToken = localStorage.getItem("idToken");
    if (!idToken) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/onboarding", {
        idToken,
        nickname,
        type, // OWNER | WALKER
      });

      const data = res.data?.data;
      if (!data?.accessToken || !data?.refreshToken) {
        throw new Error("NO_TOKEN");
      }

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // 🔑 온보딩 끝났으므로 idToken 제거
      localStorage.removeItem("idToken");

      navigate("/home", { replace: true });
    } catch (e) {
      console.error("onboarding error", e);
      alert("회원가입(온보딩)에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>닉네임을 입력해주세요</h2>

      <input
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="닉네임"
      />

      <div>
        <button
          onClick={() => setType("OWNER")}
          style={{ fontWeight: type === "OWNER" ? "bold" : "normal" }}
        >
          OWNER
        </button>
        <button
          onClick={() => setType("WALKER")}
          style={{ fontWeight: type === "WALKER" ? "bold" : "normal" }}
        >
          WALKER
        </button>
      </div>

      <button onClick={submit} disabled={loading}>
        {loading ? "처리 중..." : "시작하기"}
      </button>
    </div>
  );
}
