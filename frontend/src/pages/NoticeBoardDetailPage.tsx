// frontend/src/pages/NoticeBoardDetailPage.tsx
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./NoticeBoardDetailPage.css";

type PostDetail = {
  id: number;
  authorName: string;
  authorMeta: string;
  title: string;
  metaLine: string;
  detailLines: string[];
  statsLine: string;
};

export default function NoticeBoardDetailPage() {
  const nav = useNavigate();
  const { id } = useParams();

  const [liked, setLiked] = useState(true);

  const data: PostDetail = useMemo(() => {
    return {
      id: Number(id ?? 1),
      authorName: "강형욱",
      authorMeta: "오류동 0.8km",
      title: "산책 해주실 분 찾습니다",
      metaLine: "산책시간 30분 · 산책장소 오류동 황동수목원",
      detailLines: [
        "상세 내용",
        "강아지 견종",
        "강아지 성격 등 강아지에 관한 정보를 자유롭게 기재가능한 칸",
      ],
      statsLine: "채팅 2 · 관심 9 · 조회 101",
    };
  }, [id]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: "PawLink", url });
        return;
      }
      await navigator.clipboard.writeText(url);
      alert("링크를 복사했어요!");
    } catch {
      // 조용히 무시
    }
  };

  return (
    <div className="nbd-wrapper">
      <div className="nbd-screen">
        {/* ✅ 상단 흰 줄 방지: 상태바도 베이지로 */}
        <div className="nbd-status" />

        {/* ✅ 상단 아이콘 라인(베이지 배경) */}
        <header className="nbd-top">
          <button
            className="nbd-icon-btn"
            onClick={() => nav(-1)}
            aria-label="back"
            type="button"
          >
            <svg className="nbd-icon" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            className="nbd-icon-btn"
            aria-label="share"
            type="button"
            onClick={handleShare}
          >
            <svg className="nbd-icon" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 16V3"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M8 7l4-4 4 4"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 11v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        {/* ✅ 히어로(연베이지 + 강아지 일러스트 느낌) */}
        <section className="nbd-hero" aria-hidden="true">
          <svg className="nbd-dog" viewBox="0 0 260 200">
            {/* 몸통 */}
            <ellipse cx="120" cy="105" rx="70" ry="42" fill="#F2B15C" />
            {/* 머리 */}
            <circle cx="70" cy="95" r="38" fill="#F2B15C" />
            {/* 귀 */}
            <path
              d="M58 72c-10 8-16 18-10 28 10 4 22-2 26-12 4-10-2-18-16-16z"
              fill="#E09A42"
            />
            {/* 꼬리 */}
            <path
              d="M175 86c28 2 44 18 42 36-2 18-26 26-46 10"
              fill="none"
              stroke="#F2B15C"
              strokeWidth="16"
              strokeLinecap="round"
            />
            {/* 다리 */}
            <rect x="95" y="130" width="22" height="55" rx="10" fill="#C9863A" />
            <rect x="135" y="130" width="22" height="55" rx="10" fill="#C9863A" />
            {/* 얼굴 */}
            <circle cx="58" cy="92" r="6" fill="#2B1F17" />
            <path
              d="M76 110c-6 6-14 8-22 6"
              fill="none"
              stroke="#C9863A"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* 혀 */}
            <path
              d="M60 120c6 0 10 4 10 10s-4 12-10 12-10-6-10-12 4-10 10-10z"
              fill="#E85D5D"
              opacity="0.95"
            />
          </svg>

          {/* 점 표시(사진처럼 작게) */}
          <div className="nbd-hero-dots">
            <span className="dot on" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </section>

        {/* 작성자 카드 */}
        <section className="nbd-author">
          <div className="nbd-avatar" aria-hidden="true" />
          <div className="nbd-author-text">
            <div className="nbd-author-name">{data.authorName}</div>
            <div className="nbd-author-meta">{data.authorMeta}</div>
          </div>
        </section>

        {/* 본문 */}
        <main className="nbd-content">
          <div className="nbd-title">{data.title}</div>
          <div className="nbd-meta">{data.metaLine}</div>

          <div className="nbd-body">
            {data.detailLines.map((line, idx2) => (
              <div
                key={idx2}
                className={idx2 === 0 ? "nbd-body-head" : "nbd-body-line"}
              >
                {line}
              </div>
            ))}
          </div>

          <div className="nbd-stats">{data.statsLine}</div>

          {/* ✅ 하단 버튼이 내용 가리니까 안전 여백 */}
          <div className="nbd-safe" />
        </main>

        {/* 하단 액션바 (사진처럼: 왼쪽 하트 + 긴 채팅하기) */}
        <footer className="nbd-bottom">
          <button
            className={`nbd-heart ${liked ? "on" : ""}`}
            onClick={() => setLiked((v) => !v)}
            aria-label="like"
            type="button"
          >
            {liked ? (
              /* ✅ 눌렀을 때: 꽉 찬 빨간 하트 (정석 하트) */
              <svg className="nbd-heart-ico fill" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              /* ✅ 기본 상태: 브라운 아웃라인 하트 (정석 하트) */
              <svg className="nbd-heart-ico stroke" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="none"
                />
              </svg>
            )}
          </button>

          <button
            className="nbd-chat"
            type="button"
            onClick={() => nav(`/chat/${data.id}`)}
          >
            채팅하기
          </button>
        </footer>

        <div className="nbd-home-indicator" />
      </div>
    </div>
  );
}
