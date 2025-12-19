import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignupNickname() {
    const [name, setName] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    if (!name.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    const idToken = localStorage.getItem("idToken");
    if (!idToken) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post("/auth/login", {
        idToken,
        name,
      });

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.removeItem("idToken");

      navigate("/");
    } catch {
      alert("회원가입 실패");
    }
  };

  return (
    <div>
      <h2>닉네임을 입력해주세요</h2>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="이름 또는 닉네임"
      />
      <button onClick={submit}>시작하기</button>
    </div>
  );
}