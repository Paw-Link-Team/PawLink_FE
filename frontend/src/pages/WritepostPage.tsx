import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Writepostpage.css";

export default function Writepostpage() {
  const nav = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [walkTime, setWalkTime] = useState("");
  const [walkPlace, setWalkPlace] = useState("");

  const isComplete = useMemo(() => {
    return (
      title.trim().length > 0 &&
      content.trim().length > 0 &&
      walkTime.trim().length > 0 &&
      walkPlace.trim().length > 0
    );
  }, [title, content, walkTime, walkPlace]);

  return (
    <div className="wp-wrapper">
      <div className="wp-screen">
        <div className="wp-status" />

        {/* 헤더 */}
        <header className="wp-header">
          <button
            type="button"
            className="wp-close"
            aria-label="close"
            onClick={() => nav(-1)}
          >
            ×
          </button>
          <div className="wp-title">글쓰기</div>
          <div className="wp-right" />
        </header>

        {/* 폼 */}
        <main className="wp-body">
          <div className="wp-field">
            <div className="wp-label">제목</div>
            <input
              className="wp-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해주세요."
            />
          </div>

          <div className="wp-field">
            <div className="wp-label">산책 글 작성</div>
            <textarea
              className="wp-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="나의 반려견에 대한 설명이나 산책 내용을 작성해주세요."
            />
          </div>

          <div className="wp-field">
            <div className="wp-label">희망 산책 시간</div>
            <input
              className="wp-input"
              value={walkTime}
              onChange={(e) => setWalkTime(e.target.value)}
              placeholder="희망 산책 시간을 입력해주세요."
            />
          </div>

          <div className="wp-field">
            <div className="wp-label">희망 산책 장소</div>
            <input
              className="wp-input"
              value={walkPlace}
              onChange={(e) => setWalkPlace(e.target.value)}
              placeholder="희망 산책 장소를 입력해주세요."
            />
          </div>

          {/* 버튼이 하단에 고정이라 내용 가리지 않게 안전 여백 */}
          <div className="wp-safe" />
        </main>

        {/* 하단 버튼 */}
        <footer className="wp-footer">
          <button
            type="button"
            className={`wp-btn ${isComplete ? "active" : "disabled"}`}
            disabled={!isComplete}
            onClick={() => {
              if (!isComplete) return;
              nav("/board"); // 일단 게시판으로 복귀 (원하면 목록에 추가도 구현해줄게)
            }}
          >
            작성 완료
          </button>
        </footer>

        <div className="wp-home-indicator" />
      </div>
    </div>
  );
}
