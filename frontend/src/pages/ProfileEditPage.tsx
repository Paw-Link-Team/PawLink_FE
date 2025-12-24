import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { uploadProfileImage } from "../api/profileImage";
import NavBar from "../components/NavBar";
import "./ProfileEditPage.css";

type Role = "OWNER" | "WALKER";

const DEFAULT_PROFILE =
  "https://pawlink-profile-images.s3.ap-northeast-2.amazonaws.com/profile/default.png";

export default function ProfileEditPage() {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role>("OWNER");
  const [loading, setLoading] = useState(false);

  /* ===== 프로필 이미지 ===== */
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState(DEFAULT_PROFILE);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  /* =====================
   * 내 정보 조회
   * ===================== */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/mypage/info");
        const data = res.data?.data;

        if (data?.name) setName(data.name);
        if (data?.phoneNumber) setPhone(data.phoneNumber);
        if (data?.type) setRole(data.type);
        if (data?.profileImageUrl) {
          setProfilePreview(data.profileImageUrl);
        }
      } catch (e) {
        console.error("profile fetch failed", e);
      }
    };

    fetchProfile();

    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const canSave =
    name.trim().length > 0 &&
    phone.trim().length > 0 &&
    !loading;

  /* =====================
   * 저장
   * ===================== */
  const handleSave = async () => {
    if (!canSave) return;

    try {
      setLoading(true);

      // 1️⃣ 텍스트 정보 수정
      await api.patch("/mypage/update", {
        nickname: name.trim(),
        phoneNumber: phone.trim(),
        type: role,
      });

      // 2️⃣ 프로필 이미지 수정 (선택)
      if (profileFile) {
        await uploadProfileImage(profileFile);
      }

      nav("/mypage/profile");
    } catch (e) {
      console.error("profile update failed", e);
      alert("프로필 저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  /* =====================
   * 이미지 선택
   * ===================== */
  const pickImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="pe-wrapper">
      <div className="pe-screen">
        <div className="pe-status" />

        <header className="pe-header">
          <button
            type="button"
            className="pe-back"
            onClick={() => nav(-1)}
          >
            ←
          </button>
          <div className="pe-title">프로필 수정</div>
          <div className="pe-right" />
        </header>

        <main className="pe-body">
          {/* ===== 프로필 이미지 ===== */}
          <div className="pe-profile">
            <button
              type="button"
              className="pe-profile-box"
              onClick={pickImage}
              disabled={loading}
            >
              <img
                src={profilePreview || DEFAULT_PROFILE}
                alt=""
                className="pe-profile-img"
                onError={(e) => {
                  e.currentTarget.onerror = null; // 무한 루프 방지
                  e.currentTarget.src = DEFAULT_PROFILE;
                }}
              />
            </button>

            <div className="pe-profile-text">프로필 사진 변경</div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={onChangeImage}
              disabled={loading}
            />
          </div>


          {/* ===== 이름 ===== */}
          <div className="pe-input-wrap">
            <input
              className="pe-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              disabled={loading}
            />
          </div>

          {/* ===== 전화번호 ===== */}
          <div className="pe-input-wrap">
            <input
              className="pe-input"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/[^0-9]/g, ""))
              }
              placeholder="전화번호"
              inputMode="numeric"
              disabled={loading}
            />
          </div>

          {/* ===== 역할 ===== */}
          <div className="pe-role">
            <button
              type="button"
              className={role === "OWNER" ? "active" : ""}
              onClick={() => setRole("OWNER")}
            >
              OWNER
            </button>
            <button
              type="button"
              className={role === "WALKER" ? "active" : ""}
              onClick={() => setRole("WALKER")}
            >
              WALKER
            </button>
          </div>

          {/* ===== 저장 ===== */}
          <button
            className="pe-save"
            onClick={handleSave}
            disabled={!canSave}
          >
            저장
          </button>
        </main>

        <NavBar active="mypage" />
        <div className="pe-safe" />
      </div>
    </div>
  );
}
