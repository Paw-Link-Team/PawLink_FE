import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import "./ParentProfile.css";

/* =====================
 * 타입
 * ===================== */

type OwnerProfileResponse = {
  userId: number;
  nickname: string;
  profileImageUrl: string;
  petCount: number;
  reviewCount: number;
  startedAt: string;
};

type PetResponse = {
  id: number;
  name: string;
  age: number;
  sex: "MALE" | "FEMALE";
};

type PostResponse = {
  id: number;
  title: string;
};

export default function ParentProfile() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [profile, setProfile] = useState<OwnerProfileResponse | null>(null);
  const [pets, setPets] = useState<PetResponse[]>([]);
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);

  /* =====================
   * API 연동
   * ===================== */

  useEffect(() => {
    if (!userId) return;

    setLoading(true);

    Promise.all([
      api.get<OwnerProfileResponse>(`/api/owners/${userId}`),
      api.get<PetResponse[]>(`/api/owners/${userId}/pets`),
      api.get<PostResponse[]>(`/api/owners/${userId}/posts`),
    ])
      .then(([profileRes, petRes, postRes]) => {
        setProfile(profileRes.data);
        setPets(petRes.data);
        setPosts(postRes.data);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading || !profile) {
    return <div className="pp-loading">로딩 중...</div>;
  }

  /* =====================
   * 렌더
   * ===================== */

  return (
    <div className="pp-root">
      <div className="pp-phone">
        {/* 헤더 */}
        <header className="pp-top">
          <button
            className="pp-icon-btn"
            aria-label="back"
            type="button"
            onClick={() => navigate(-1)}
          >
            ←
          </button>

          <button
            className="pp-icon-btn"
            aria-label="share"
            type="button"
            onClick={() => setIsShareOpen(true)}
          >
            ⤴
          </button>
        </header>

        {/* 프로필 */}
        <section className="pp-profile">
          <div className="pp-avatar">
            {profile.profileImageUrl && (
              <img src={profile.profileImageUrl} alt="profile" />
            )}
          </div>

          <div className="pp-profile-info">
            <div className="pp-name">{profile.nickname}</div>
          </div>

          <div className="pp-metrics">
            <div className="pp-metric">
              <div className="pp-metric-label">반려견</div>
              <div className="pp-metric-value">{profile.petCount}마리</div>
            </div>

            <div className="pp-metric">
              <div className="pp-metric-label">작성리뷰</div>
              <div className="pp-metric-value">{profile.reviewCount}개</div>
            </div>
          </div>
        </section>

        {/* 반려견 */}
        <section className="pp-section">
          <div className="pp-section-title">
            {profile.nickname}님의 반려견
          </div>

          <div className="pp-pets">
            {pets.map((p) => (
              <div key={p.id} className="pp-pet">
                <div className="pp-pet-name">{p.name}</div>
                <div className="pp-pet-meta">
                  {p.age}세 / {p.sex === "MALE" ? "남아" : "여아"}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 게시글 */}
        <section className="pp-section">
          <div className="pp-section-title">
            {profile.nickname}님의 게시글
          </div>

          <div className="pp-posts">
            {posts.map((post) => (
              <div key={post.id} className="pp-post">
                <div className="pp-post-title">{post.title}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 공유 모달 */}
        {isShareOpen && (
          <div
            className="pp-share-dim"
            onClick={() => setIsShareOpen(false)}
          >
            <div
              className="pp-share-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pp-share-title">
                공유 방법을 선택하세요
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
