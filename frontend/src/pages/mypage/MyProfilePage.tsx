import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { useMyPage } from "../../hooks/useMyPage";
import api from "../../api/api";
import "./MyProfilePage.css";

/* =====================
 * 타입
 * ===================== */
type Pet = {
  id: number;
  petName: string;
  petAge: number;
  petSex: "MALE" | "FEMALE";
  petType: string;
  petProfileImageUrl: string;
  isRepresentative: boolean;
};

const DEFAULT_PROFILE_IMAGE =
  "https://pawlink-profile-images.s3.ap-northeast-2.amazonaws.com/profile/default.png";

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
        const res = await api.get("/api/pet/info");
        setPets(res.data?.data ?? []);
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
   * 로그아웃
   * ===================== */
  const handleLogout = () => {
    if (!confirm("로그아웃 하시겠습니까?")) return;
    localStorage.clear();
    nav("/login", { replace: true });
  };

  /* =====================
   * 회원 탈퇴
   * ===================== */
  const handleWithdraw = async () => {
    if (
      !confirm(
        "정말로 회원 탈퇴하시겠습니까?\n탈퇴 시 모든 정보는 삭제되며 복구할 수 없습니다."
      )
    ) {
      return;
    }

    try {
      await api.delete("/mypage/delete");
      localStorage.clear();
      nav("/login", { replace: true });
    } catch (e) {
      alert("회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  if (userLoading || petLoading) {
    return <div className="myp-loading">로딩중...</div>;
  }

  return (
    <div className="myp-wrapper">
      <div className="myp-screen">
        <header className="mp-header">마이페이지</header>

        <main className="myp-body">
          {/* ===== 유저 프로필 ===== */}
          <section className="myp-section">
            <div className="myp-profile-row">
              <div className="myp-left">
                <div className="myp-avatar">
                  <img
                    src={user?.profileImageUrl || DEFAULT_PROFILE_IMAGE}
                    alt="profile"
                    className="myp-avatar-img"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
                    }}
                  />
                </div>
                <div className="myp-name">{user?.nickname ?? "사용자"}</div>
              </div>

              <button
                className="myp-edit-btn"
                onClick={() => nav("/mypage/profile/edit")}
              >
                ✎
              </button>
            </div>
          </section>

          {/* ===== 반려견 ===== */}
          <section className="myp-section">
            <div className="myp-section-title">반려견 프로필</div>

            {pets.length === 0 && (
              <div className="myp-dog-empty">
                <p>아직 등록된 반려견이 없어요 🐾</p>
                <button
                  className="myp-dog-add-btn"
                  onClick={() => nav("/mypage/pet/create")}
                >
                  + 반려견 추가
                </button>
              </div>
            )}

            {pets.length > 0 && (
              <div className="myp-dog-list">
                {pets.map((pet) => (
                  <div
                    key={pet.id}
                    className="myp-dog-card"
                    onClick={() => nav(`/mypage/pet/${pet.id}/edit`)}
                  >
                    <img
                      src={pet.petProfileImageUrl}
                      alt="pet"
                      className="myp-dog-img"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
                      }}
                    />
                    <div className="myp-dog-info">
                      <div className="myp-dog-name">{pet.petName}</div>
                      <div className="myp-dog-sub">
                        {pet.petAge}살 ·{" "}
                        {pet.petSex === "MALE" ? "수컷" : "암컷"}
                      </div>
                      <div className="myp-dog-type">{pet.petType}</div>
                    </div>
                  </div>
                ))}

                <button
                  className="myp-dog-add-card"
                  onClick={() => nav("/mypage/pet/create")}
                >
                  +
                </button>
              </div>
            )}
          </section>

          {/* ===== 설정 ===== */}
          <section className="myp-setting-section">
            <div className="myp-setting-title">설정</div>

            <button
              className="myp-setting-item logout"
              onClick={handleLogout}
            >
              로그아웃
              <span className="arrow">›</span>
            </button>

            <button
              className="myp-setting-item withdraw"
              onClick={handleWithdraw}
            >
              회원 탈퇴
            </button>
          </section>
        </main>

        <NavBar active="mypage" />
        <div className="myp-safe" />
      </div>
    </div>
  );
}
