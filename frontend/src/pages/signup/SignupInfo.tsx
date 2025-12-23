import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./SignupInfo.css";
import Header from "../../components/Header/Brand";

type UserType = "OWNER" | "WALKER";

export default function SignupInfo() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);

  const isValid =
    nickname.trim() !== "" &&
    phone.trim() !== "" &&
    type !== null;

  const submit = async () => {
    if (!isValid) {
      if (!nickname.trim()) alert("닉네임을 입력해주세요.");
      else if (!phone.trim()) alert("전화번호를 입력해주세요.");
      else alert("역할을 선택해주세요.");
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
        nickname: nickname.trim(),
        phone: phone.trim(),
        type,
      });

      const token = res.data?.data;
      if (!token?.accessToken || !token?.refreshToken) {
        throw new Error("INVALID_TOKEN_RESPONSE");
      }

      localStorage.setItem("accessToken", token.accessToken);
      localStorage.setItem("refreshToken", token.refreshToken);
      localStorage.removeItem("idToken");

      navigate("/signup/complete", { replace: true });
    } catch (error) {
      console.error("Signup onboarding failed:", error);
      alert("회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    const onlyNumber = value.replace(/[^0-9]/g, "");
    setPhone(onlyNumber);
  };

  return (
    <div className="signup-root">
      <Header variant="brand" />

      <div className="signup-card">
        <section className="signup-content">
          <span className="step">2/2</span>

          <FormGroup label="닉네임">
            <input
              className="text-input"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임"
              disabled={loading}
            />
          </FormGroup>

          {/* 🔹 전화번호 추가 */}
          <FormGroup label="전화번호">
            <input
              className="text-input phone-input"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="01012345678"
              inputMode="numeric"
              disabled={loading}
            />
          </FormGroup>

          <FormGroup label="역할 선택">
            <div className="type-select">
              <RoleButton
                active={type === "OWNER"}
                onClick={() => setType("OWNER")}
              >
                OWNER
              </RoleButton>
              <RoleButton
                active={type === "WALKER"}
                onClick={() => setType("WALKER")}
              >
                WALKER
              </RoleButton>
            </div>
          </FormGroup>
        </section>

        <footer className="signup-footer">
          <button onClick={submit} disabled={loading}>
            {loading ? "처리 중..." : "회원가입"}
          </button>
        </footer>
      </div>
    </div>
  );
}

type FormGroupProps = {
  label: string;
  children: React.ReactNode;
};

function FormGroup({ label, children }: FormGroupProps) {
  return (
    <div className="form-group">
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

type RoleButtonProps = {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function RoleButton({ active, onClick, children }: RoleButtonProps) {
  return (
    <button
      type="button"
      className={active ? "active" : ""}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
