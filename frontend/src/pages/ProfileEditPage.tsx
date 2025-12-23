import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "./ProfileEditPage.css";

const LS_KEY = "pawlink_my_name";

export default function ProfileEditPage() {
  const nav = useNavigate();
  const [name, setName] = useState("");

  // ✅ 처음 들어오면 localStorage에 저장된 이름이 있으면 불러오기
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved && saved.trim()) setName(saved);
  }, []);

  const canSave = name.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    localStorage.setItem(LS_KEY, name.trim());
    nav("/mypage/profile"); // ✅ 3번째 사진의 마이페이지(마이프로필)로 복귀
  };

  return (
    <div className="pe-wrapper">
      <div className="pe-screen">
        <div className="pe-status" />

        <header className="pe-header">
          <button type="button" className="pe-back" onClick={() => nav(-1)} aria-label="back">
            ←
          </button>
          <div className="pe-title">프로필 수정</div>
          <div className="pe-right" />
        </header>

        <main className="pe-body">
          <div className="pe-row">
            <div className="pe-paw" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="pe-paw-ico">
                <circle cx="7.3" cy="8.4" r="2.0" />
                <circle cx="12" cy="6.9" r="2.1" />
                <circle cx="16.7" cy="8.4" r="2.0" />
                <circle cx="19.1" cy="11.6" r="1.85" />
                <path d="M6.2 16.4c0-3.0 2.9-5.3 5.8-5.3s5.8 2.3 5.8 5.3c0 2.5-2.2 4.6-5.8 4.6s-5.8-2.1-5.8-4.6z" />
              </svg>
            </div>

            {/* ✅ input + 체크버튼(오른쪽 끝) */}
            <div className="pe-input-wrap">
              <input
                className="pe-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력해주세요"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                }}
              />

              {canSave && (
                <button
                  type="button"
                  className="pe-check"
                  aria-label="confirm"
                  onClick={handleSave}
                >
                  ✓
                </button>
              )}
            </div>
          </div>
        </main>

        <NavBar active="mypage" />
        <div className="pe-safe" />
      </div>
    </div>
  );
}
