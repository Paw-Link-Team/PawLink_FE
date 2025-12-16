// frontend/src/pages/ParentProfile.tsx
import { useState } from "react";
import "./ParentProfile.css";

type Pet = {
  id: number;
  name: string;
  meta: string; // ex) "반려견 나이/성별"
};

type Post = {
  id: number;
  title: string;
};

export default function ParentProfile() {
  const [isShareOpen, setIsShareOpen] = useState(false);

  const pets: Pet[] = [
    { id: 1, name: "반려견 이름", meta: "반려견 나이/성별" },
    { id: 2, name: "코코", meta: "3세/남아" },
  ];

  const posts: Post[] = [
    { id: 1, title: "게시글 제목" },
    { id: 2, title: "(마감)산책구..." },
    { id: 3, title: "(마감)산책구..." },
  ];

  return (
    <div className="pp-root">
      <div className="pp-phone">
        {/* 상단 헤더(연베이지 영역) */}
        <header className="pp-top">
          <button className="pp-icon-btn" aria-label="back" type="button">
            {/* ← */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            className="pp-icon-btn"
            aria-label="share"
            type="button"
            onClick={() => setIsShareOpen(true)}
          >
            {/* 공유 아이콘 */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 16V4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M8 8l4-4 4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        {/* 프로필 카드 */}
        <section className="pp-profile">
          <div className="pp-avatar" aria-hidden>
            {/* 사람 아이콘 */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
                fill="currentColor"
                opacity="0.95"
              />
              <path
                d="M4.5 20a7.5 7.5 0 0 1 15 0"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="pp-profile-info">
            <div className="pp-name">강형욱</div>
            <div className="pp-sub">구로구 항동</div>
            <div className="pp-sub">010-0000-0000</div>
          </div>

          <div className="pp-metrics">
            <div className="pp-metric">
              <div className="pp-metric-top">
                <span className="pp-star">★</span>
                <span className="pp-metric-value">4.9점</span>
              </div>
            </div>

            <div className="pp-metric">
              <div className="pp-metric-label">산책거리</div>
              <div className="pp-metric-value">10km</div>
            </div>

            <div className="pp-metric">
              <div className="pp-metric-label">함께걸은강아지</div>
              <div className="pp-metric-value">25마리</div>
            </div>
          </div>
        </section>

        {/* 반려견 섹션 */}
        <section className="pp-section">
          <div className="pp-section-title">강형욱님의 반려견</div>

          <div className="pp-pets">
            {pets.map((p) => (
              <div key={p.id} className="pp-pet">
                <div className="pp-pet-circle" aria-hidden>
                  {/* 강아지 아이콘(심플) */}
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M8 9c.7-1.7 2.2-2.6 4-2.6S15.3 7.3 16 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M7 12c0-1.7 2.2-3 5-3s5 1.3 5 3-2.2 5-5 5-5-3.3-5-5Z"
                      fill="currentColor"
                      opacity="0.18"
                    />
                    <path
                      d="M10 13h.01M14 13h.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M11 15c.6.5 1.4.5 2 0"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="pp-pet-name">{p.name}</div>
                <div className="pp-pet-meta">{p.meta}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 게시글 섹션 */}
        <section className="pp-section">
          <div className="pp-section-title">강형욱님의 게시글</div>

          <div className="pp-posts">
            {posts.map((post) => (
              <div key={post.id} className="pp-post">
                <div className="pp-post-thumb" aria-hidden>
                  {/* 썸네일 자리 */}
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 12c.7-1.7 2.2-2.6 5-2.6s4.3.9 5 2.6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M7 13c0-1.7 2.2-3 5-3s5 1.3 5 3-2.2 5-5 5-5-3.3-5-5Z"
                      fill="currentColor"
                      opacity="0.15"
                    />
                  </svg>
                </div>
                <div className="pp-post-title">{post.title}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 하단 네브(모양만) */}
        <nav className="pp-nav">
          <div className="pp-nav-item">
            <div className="pp-nav-ico">⌂</div>
            <div className="pp-nav-txt">홈</div>
          </div>

          <div className="pp-nav-item">
            <div className="pp-nav-ico">▣</div>
            <div className="pp-nav-txt">게시판</div>
          </div>

          <div className="pp-nav-item">
            <div className="pp-nav-ico">💬</div>
            <div className="pp-nav-txt">채팅</div>
          </div>

          <div className="pp-nav-item active">
            <div className="pp-nav-ico">👤</div>
            <div className="pp-nav-txt">마이페이지</div>
          </div>
        </nav>

        <div className="pp-home-indicator" />

        {/* 공유 모달 */}
        {isShareOpen && (
          <div
            className="pp-share-dim"
            role="button"
            tabIndex={0}
            onClick={() => setIsShareOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") setIsShareOpen(false);
            }}
          >
            <div
              className="pp-share-modal"
              role="dialog"
              aria-modal="true"
              aria-label="share modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pp-share-title">공유 방법을 선택하세요</div>

              <div className="pp-share-actions">
                <button className="pp-share-btn" type="button" aria-label="kakao">
                  <span className="pp-share-circle">💬</span>
                </button>
                <button className="pp-share-btn" type="button" aria-label="message">
                  <span className="pp-share-circle">✉️</span>
                </button>
                <button className="pp-share-btn" type="button" aria-label="link">
                  <span className="pp-share-circle">🔗</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
