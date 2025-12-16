// frontend/src/pages/WalkerProfile.tsx
import { useMemo, useState } from "react";
import "./WalkerProfile.css";

type Review = {
  id: number;
  name: string;
  region: string;
  text: string;
};

export default function WalkerProfile() {
  const [isShareOpen, setIsShareOpen] = useState(false);

  const tags = useMemo(() => ["#소형견산책", "#리드줄착용", "#시간엄수"], []);

  const reviews: Review[] = useMemo(
    () => [
      {
        id: 1,
        name: "모르는개산책",
        region: "구로구 항동",
        text: "애기가 정말 순하고 주인분이 정말 친절하세요!!\n응답도 정말 빠르십니다ㅎㅎ",
      },
    ],
    []
  );

  return (
    <div className="wp-root">
      <div className="wp-phone">
        {/* 상단 헤더 */}
        <header className="wp-header">
          <button className="wp-icon-btn" aria-label="back">
            {/* back icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="wp-header-spacer" />

          <button
            className="wp-icon-btn"
            aria-label="share"
            onClick={() => setIsShareOpen(true)}
            type="button"
          >
            {/* share icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M12 16V4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M7.5 8.5L12 4l4.5 4.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </header>

        {/* 본문 */}
        <main className="wp-content">
          {/* 프로필 상단 카드 영역 */}
          <section className="wp-card">
            <div className="wp-profile-row">
              <div className="wp-avatar" aria-hidden />
              <div className="wp-profile-meta">
                <div className="wp-name">강형욱</div>
                <div className="wp-sub">구로구 항동</div>
                <div className="wp-sub">010-0000-0000</div>
              </div>
            </div>

            {/* 지표 3개 */}
            <div className="wp-metrics">
              <div className="wp-metric">
                <div className="wp-metric-top">
                  <span className="wp-star">★</span>
                  <span className="wp-metric-val">4.9점</span>
                </div>
              </div>

              <div className="wp-metric">
                <div className="wp-metric-label">누적산책거리</div>
                <div className="wp-metric-val">10km</div>
              </div>

              <div className="wp-metric">
                <div className="wp-metric-label">함께걸은강아지</div>
                <div className="wp-metric-val">25마리</div>
              </div>
            </div>

            <div className="wp-intro">3년째 반려견 봉사 돌봄 중</div>

            <div className="wp-tags">
              {tags.map((t) => (
                <span key={t} className="wp-tag">
                  {t}
                </span>
              ))}
            </div>
          </section>

          {/* 리뷰 목록 */}
          <section className="wp-reviews">
            <div className="wp-section-title">리뷰 목록</div>

            {reviews.map((r) => (
              <div key={r.id} className="wp-review-item">
                <div className="wp-review-avatar" aria-hidden />
                <div className="wp-review-body">
                  <div className="wp-review-name">{r.name}</div>
                  <div className="wp-review-sub">{r.region}</div>
                  <div className="wp-review-text">{r.text}</div>
                </div>
              </div>
            ))}
          </section>
        </main>

        {/* 하단 네브(모양만) */}
        <nav className="wp-nav">
          <div className="wp-nav-item">
            <div className="wp-nav-ico">⌂</div>
            <div className="wp-nav-txt">홈</div>
          </div>
          <div className="wp-nav-item">
            <div className="wp-nav-ico">▣</div>
            <div className="wp-nav-txt">게시판</div>
          </div>
          <div className="wp-nav-item">
            <div className="wp-nav-ico">💬</div>
            <div className="wp-nav-txt">채팅</div>
          </div>
          <div className="wp-nav-item active">
            <div className="wp-nav-ico">👤</div>
            <div className="wp-nav-txt">마이페이지</div>
          </div>
        </nav>

        <div className="wp-home-indicator" />

        {/* 공유 모달 */}
        {isShareOpen && (
          <div
            className="wp-modal-backdrop"
            onClick={() => setIsShareOpen(false)}
            role="presentation"
          >
            <div
              className="wp-modal"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <div className="wp-modal-title">공유 방법을 선택하세요</div>

              <div className="wp-modal-actions">
                <button className="wp-share-btn" type="button" aria-label="kakao">
                  <span className="wp-share-dot">K</span>
                </button>
                <button className="wp-share-btn" type="button" aria-label="message">
                  <span className="wp-share-dot">✉</span>
                </button>
                <button className="wp-share-btn" type="button" aria-label="link">
                  <span className="wp-share-dot">⛓</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
