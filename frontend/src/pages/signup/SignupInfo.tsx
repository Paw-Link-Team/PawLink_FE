import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import "./SignupInfo.css";
import Header from "../../components/Header/Brand";

type UserType = "OWNER" | "WALKER";

const DEFAULT_PROFILE =
  "https://pawlink-profile-images.s3.ap-northeast-2.amazonaws.com/profile/default.png";

export default function SignupInfo() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);

  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState(DEFAULT_PROFILE);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const isValid =
    nickname.trim() !== "" && phone.trim() !== "" && type !== null;

  // ObjectURL 정리
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

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

      const formData = new FormData();

      // ✅ JSON → Blob → data
      formData.append(
        "data",
        new Blob(
          [
            JSON.stringify({
              idToken,
              nickname: nickname.trim(),
              phoneNumber: phone.trim(),
              type,
            }),
          ],
          { type: "application/json" }
        )
      );

      // ✅ 이미지 포함 (선택)
      if (profileFile) {
        formData.append("image", profileFile);
      }

      const res = await api.post("/auth/onboarding", formData, {
        // ❌ Content-Type 절대 지정하지 말 것
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const token = res.data?.data;
      if (!token?.accessToken || !token?.refreshToken) {
        throw new Error("INVALID_TOKEN_RESPONSE");
      }

      localStorage.setItem("accessToken", token.accessToken);
      localStorage.setItem("refreshToken", token.refreshToken);
      localStorage.removeItem("idToken");

      navigate("/signup/complete", { replace: true });
    } catch (e) {
      console.error(e);
      alert("회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const pickProfileImage = () => {
    if (!profileInputRef.current) return;
    profileInputRef.current.value = "";
    profileInputRef.current.click();
  };

  const onChangeProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;

    setProfileFile(file);
    setProfilePreview(url);
  };

  const handlePhoneChange = (v: string) => {
    setPhone(v.replace(/[^0-9]/g, ""));
  };

  return (
    <div className="signup-root">
      <Header variant="brand" />

      <div className="signup-card">
        <section className="signup-content">
          <span className="step">2/2</span>

          <div className="signup-profile">
            <button
              type="button"
              className="profile-image-box"
              onClick={pickProfileImage}
              disabled={loading}
            >
              <img
                src={profilePreview}
                alt="profile"
                className="profile-image"
              />
            </button>
            <div className="profile-text">프로필 사진</div>

            <input
              ref={profileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={onChangeProfile}
              disabled={loading}
            />
          </div>

          <FormGroup label="닉네임">
            <input
              className="text-input"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임"
              disabled={loading}
            />
          </FormGroup>

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

          <FormGroup label="역할">
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

/* =====================
   UI Components
   ===================== */

function FormGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="form-group">
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

function RoleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
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
