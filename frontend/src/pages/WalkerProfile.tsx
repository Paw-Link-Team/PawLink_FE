import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import api from "../api/api";
import "./WalkerProfile.css";

/* =====================
 * 타입 정의
 * ===================== */

type WalkerProfileResponse = {
  userId: number;
  nickname: string;
  profileImageUrl: string;
  rating: number;
  totalDistanceKm: number;
  walkCount: number;
  careerYears: number;
};

type ReviewResponse = {
  reviewId: number;
  writerId: number;
  writerNickname: string;
  writerProfileImageUrl: string;
  rating: number;
  content: string;
  createdAt: string;
};

/* =====================
 * 컴포넌트
 * ===================== */

export default function WalkerProfile() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [profile, setProfile] =
    useState<WalkerProfileResponse | null>(null);
  const [reviews, setReviews] =
    useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const tags = useMemo(
    () => ["#소형견산책", "#리드줄착용", "#시간엄수"],
    []
  );

  /* =====================
   * API 호출
   * ===================== */

  useEffect(() => {
    if (!userId) return;

    setLoading(true);

    Promise.all([
      api.get<WalkerProfileResponse>(
        `/api/walkers/${userId}`
      ),
      api.get<ReviewResponse[]>(
        `/api/walkers/${userId}/reviews`
      ),
    ])
      .then(([profileRes, reviewRes]) => {
        setProfile(profileRes.data);
        setReviews(reviewRes.data);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  /* =====================
   * 로딩
   * ===================== */

  if (loading || !profile) {
    return (
      <div className="walker-root">
        <div className="wp-loading">로딩 중...</div>
      </div>
    );
  }

  /* =====================
   * 렌더링
   * ===================== */

  return (
    <div className="walker-root">
      <div className="wp-wrapper">
        <div className="wp-screen">
          {/* 상태바 */}
          <div className="wp-status-bar" />

          {/* 헤더 */}
          <header className="wp-header">
            <button
              className="wp-icon-btn"
              aria-label="back"
              type="button"
              onClick={() => navigate(-1)}
            >
              ←
            </button>

            <div className="wp-header-title" />

            <button
              className="wp-icon-btn"
              aria-label="share"
              type="button"
              onClick={() => setIsShareOpen(true)}
            >
              ⤴
            </button>
          </header>

          {/* 본문 */}
          <main className="wp-content">
            <section className="wp-hero" aria-hidden />

            {/* 프로필 카드 */}
            <section className="wp-card">
              <div className="wp-profile-row">
                <div className="wp-avatar">
                  {profile.profileImageUrl && (
                    <img
                      src={profile.profileImageUrl}
                      alt="profile"
                    />
                  )}
                </div>

                <div className="wp-profile-meta">
                  <div className="wp-name">
                    {profile.nickname}
                  </div>
                </div>
              </div>

              {/* 지표 */}
              <div className="wp-metrics">
                <Metric
                  label="평점"
                  value={`${profile.rating.toFixed(1)}점`}
                />
                <Metric
                  label="누적산책거리"
                  value={`${profile.totalDistanceKm}km`}
                />
                <Metric
                  label="함께걸은강아지"
                  value={`${profile.walkCount}마리`}
                />
              </div>

              <div className="wp-intro">
                {profile.careerYears}년째 반려견 봉사
                돌봄 중
              </div>

              <div className="wp-tags">
                {tags.map((t) => (
                  <span key={t} className="wp-tag">
                    {t}
                  </span>
                ))}
              </div>
            </section>

            {/* 리뷰 */}
            <section className="wp-reviews">
              <div className="wp-section-title">
                리뷰 목록
              </div>

              {reviews.length === 0 && (
                <div className="wp-empty">
                  아직 리뷰가 없습니다
                </div>
              )}

              {reviews.map((r) => (
                <div
                  key={r.reviewId}
                  className="wp-review-item"
                >
                  <div className="wp-review-avatar">
                    {r.writerProfileImageUrl && (
                      <img
                        src={r.writerProfileImageUrl}
                        alt="reviewer"
                      />
                    )}
                  </div>

                  <div className="wp-review-body">
                    <div className="wp-review-name">
                      {r.writerNickname}
                    </div>
                    <div className="wp-review-text">
                      {r.content}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </main>

          {/* 하단 네비 */}
          <NavBar active="mypage" />

          {/* 공유 모달 */}
          {isShareOpen && (
            <div
              className="wp-modal-backdrop"
              onClick={() => setIsShareOpen(false)}
            >
              <div
                className="wp-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="wp-modal-title">
                  공유 방법을 선택하세요
                </div>

                <div className="wp-modal-actions">
                  <button className="wp-share-btn">
                    K
                  </button>
                  <button className="wp-share-btn">
                    ✉
                  </button>
                  <button className="wp-share-btn">
                    ⛓
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =====================
 * 보조 컴포넌트
 * ===================== */

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="wp-metric">
      <div className="wp-metric-label">
        {label}
      </div>
      <div className="wp-metric-val">
        {value}
      </div>
    </div>
  );
}
