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

  return (
    <div className="nbd-root">
      <div className="nbd-phone">
        {/* 상단바 */}
        <header className="nbd-top">
          <button
            className="nbd-icon-btn"
            onClick={() => nav(-1)}
            aria-label="back"
            type="button"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button className="nbd-icon-btn" aria-label="share" type="button">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M16 6l-8 4 8 4"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 6V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </header>

        {/* 상단 이미지 */}
        <section className="nbd-hero" />

        {/* 작성자 */}
        <section className="nbd-author">
          <div className="nbd-avatar" />
          <div className="nbd-author-text">
            <div className="nbd-author-name">{data.authorName}</div>
            <div className="nbd-author-meta">{data.authorMeta}</div>
          </div>
        </section>

        {/* 본문 */}
        <section className="nbd-content">
          <div className="nbd-title">{data.title}</div>
          <div className="nbd-meta">{data.metaLine}</div>

          <div className="nbd-body">
            {data.detailLines.map((line, idx) => (
              <div
                key={idx}
                className={idx === 0 ? "nbd-body-head" : "nbd-body-line"}
              >
                {line}
              </div>
            ))}
          </div>

          <div className="nbd-stats">{data.statsLine}</div>
        </section>

        {/* 하단 액션바 */}
        <footer className="nbd-bottom">
          {/* ❤️ 하트 */}
          <button
            className={`nbd-like ${liked ? "on" : ""}`}
            onClick={() => setLiked((v) => !v)}
            aria-label="like"
            type="button"
          >
            <svg width="26" height="26" viewBox="0 0 24 24">
              <path
                d="M12 21s-7-4.5-9.5-8.5C.5 9 2.5 6 6 6c2 0 3.2 1.1 4 2 0 0 1.2-2 4-2 3.5 0 5.5 3 3.5 6.5C19 16.5 12 21 12 21z"
                fill="currentColor"
              />
            </svg>
          </button>

          {/* 💬 채팅하기 */}
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
