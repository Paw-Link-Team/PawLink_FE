import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { useMyPage } from "../../hooks/useMyPage";
import "./MyProfilePage.css";

/* =====================
 * 타입 정의
 * ===================== */
type Pet = {
  id: number;
  petName: string;
  petAge: number;
  petSex: "MALE" | "FEMALE";
  petType: string;
  petProfileImageUrl?: string | null;
};

export default function MyProfilePage() {
  const nav = useNavigate();

  const { user, loading: userLoading } = useMyPage();

  const [pets, setPets] = useState<Pet[]>([]);
  const [petLoading, setPetLoading] = useState(true);

  /* =====================
   * 반려견 조회
   * ===================== */
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch("/api/pets/info", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const json = await res.json();
        setPets(json.data ?? []);
      } catch (e) {
        console.error("반려견 조회 실패", e);
        setPets([]);
      } finally {
        setPetLoading(false);
      }
    };

    fetchPets();
  }, []);

  /* =====================
   * 이미지 업로드 (추후 확장)
   * ===================== */
  const dogFileRef = useRef<HTMLInputElement | null>(null);
  const pickDogImage = () => dogFileRef.current?.click();

  /* =====================
   * 로딩 처리
   * ===================== */
  if (userLoading || petLoading) {
    return <div className="myp-wrapper">로딩중...</div>;
  }

  const hasPet = pets.length > 0;
  const pet = pets[0]; // 대표 반려견

  return (
    <div className="myp-wrapper">
      <div className="myp-screen">
        <div className="myp-status" />

        {/* ===== 상단 ===== */}
        <header className="myp-top">
          <div className="myp-top-title">마이페이지</div>
        </header>

        <main className="myp-body">
          {/* ===== 내 프로필 ===== */}
          <section className="myp-section">
            <div className="myp-profile-row">
              <div className="myp-left">
                <div className="myp-avatar">
                  {user?.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt="profile"
                      className="myp-avatar-img"
                    />
                  ) : (
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
                  )}
                </div>

                <div className="myp-name">
                  {user?.nickname ?? "사용자"}
                </div>
              </div>


              <button
                className="myp-edit-btn"
                onClick={() => nav("/mypage/profile/edit")}
              >
                ✎
              </button>
            </div>
          </section>

          {/* ===== 반려견 프로필 ===== */}
          <section className="myp-section">
            <div className="myp-section-title">반려견 프로필</div>

            {/* === 반려견 없음 === */}
            {!hasPet && (
              <div className="myp-dog-empty">
                <div className="myp-dog-empty-text">
                  아직 등록된 반려견이 없어요 🐾
                </div>
                <button
                  className="myp-dog-add-btn"
                  onClick={() => nav("/mypage/pet/create")}
                >
                  + 반려견 추가하기
                </button>
              </div>
            )}

            {/* === 반려견 있음 === */}
            {hasPet && (
              <div className="myp-dog-card">
                <button
                  type="button"
                  className="myp-dog-ava-img"
                  onClick={pickDogImage}
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
                    <span className="myp-dog-v">{pet.petName}</span>
                  </div>
                  <div className="myp-dog-line">
                    <span className="myp-dog-k">나이 :</span>
                    <span className="myp-dog-v">{pet.petAge}살</span>
                  </div>
                  <div className="myp-dog-line">
                    <span className="myp-dog-k">성별 :</span>
                    <span className="myp-dog-v">
                      {pet.petSex === "MALE" ? "남자" : "여자"}
                    </span>
                  </div>
                  <div className="myp-dog-line">
                    <span className="myp-dog-k">견종 :</span>
                    <span className="myp-dog-v">{pet.petType}</span>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>

        <NavBar active="mypage" />
        <div className="myp-safe" />
      </div>
    </div>
  );
}
