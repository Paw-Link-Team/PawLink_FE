import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "./MyProfilePage.css";

type DogProfile = {
  name: string;
  age: string;
  gender: string;
  breed: string;
};

const LS_KEY = "pawlink_my_name";

export default function MyProfilePage() {
  const nav = useNavigate();
  const location = useLocation();

  const [myName, setMyName] = useState("강형욱");

  // ✅ 프로필 수정 후 돌아오면 이름 다시 로드
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved && saved.trim()) setMyName(saved.trim());
  }, [location.pathname]);

  const [dog] = useState<DogProfile>({
    name: "코코",
    age: "3살",
    gender: "남자",
    breed: "푸들",
  });

  const dogFileRef = useRef<HTMLInputElement | null>(null);
  const pickDogImage = () => dogFileRef.current?.click();

  return (
    <div className="myp-wrapper">
      <div className="myp-screen">
        <div className="myp-status" />

        {/* 상단 타이틀 */}
        <header className="myp-top">
          <div className="myp-top-title">마이페이지</div>
        </header>

        <main className="myp-body">
          {/* ===== 내 프로필 ===== */}
          <section className="myp-section">
            <div className="myp-profile-row">
              <div className="myp-left">
                {/* 갈색 원 + 흰 발바닥 */}
                <div className="myp-avatar" aria-hidden>
                  <svg
                    className="myp-paw-ico"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle cx="7.3" cy="8.4" r="2.0" />
                    <circle cx="12" cy="6.9" r="2.1" />
                    <circle cx="16.7" cy="8.4" r="2.0" />
                    <circle cx="19.1" cy="11.6" r="1.85" />
                    <path d="M6.2 16.4c0-3.0 2.9-5.3 5.8-5.3s5.8 2.3 5.8 5.3c0 2.5-2.2 4.6-5.8 4.6s-5.8-2.1-5.8-4.6z" />
                  </svg>
                </div>

                <div className="myp-name">{myName}</div>
              </div>

              {/* 연필 → 프로필 수정 */}
              <button
                className="myp-edit-btn"
                onClick={() => nav("/mypage/profile/edit")}
                aria-label="edit profile"
              >
                ✎
              </button>
            </div>
          </section>

          {/* ===== 반려견 프로필 ===== */}
          <section className="myp-section">
            <div className="myp-section-title">반려견 프로필</div>

            <div className="myp-dog-card">
              <button
                type="button"
                className="myp-dog-ava-img"
                onClick={pickDogImage}
                aria-label="dog image"
              >
                <span className="myp-dog-face">🐶</span>
              </button>

              <input
                ref={dogFileRef}
                type="file"
                accept="image/*"
                className="myp-hidden-file"
              />

              <div className="myp-dog-info">
                <div className="myp-dog-line">
                  <span className="myp-dog-k">이름 :</span>
                  <span className="myp-dog-v">{dog.name}</span>
                </div>
                <div className="myp-dog-line">
                  <span className="myp-dog-k">나이 :</span>
                  <span className="myp-dog-v">{dog.age}</span>
                </div>
                <div className="myp-dog-line">
                  <span className="myp-dog-k">성별 :</span>
                  <span className="myp-dog-v">{dog.gender}</span>
                </div>
                <div className="myp-dog-line">
                  <span className="myp-dog-k">견종 :</span>
                  <span className="myp-dog-v">{dog.breed}</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        <NavBar active="mypage" />
        <div className="myp-safe" />
      </div>
    </div>
  );
}