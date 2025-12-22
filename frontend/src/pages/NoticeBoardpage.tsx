// frontend/src/pages/NoticeBoardPage.tsx
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "./NoticeBoardpage.css";

const POSTS_ALL = [
  { id: 1, title: "산책 해주실 분 찾습니다", desc: "소형견 푸들이고 성격은 활발한 편입니다!", thumb: "🐕" },
  { id: 2, title: "게시물 제목", desc: "게시물의 내용이 표시됩니다 일정이상 길어지면 ...", thumb: "🐕" },
  { id: 3, title: "게시물 제목", desc: "게시물의 내용이 표시됩니다 일정이상 길어지면 ...", thumb: "🐕" },
  { id: 4, title: "게시물 제목", desc: "게시물의 내용이 표시됩니다 일정이상 길어지면 ...", thumb: "🐕" },
  { id: 5, title: "게시물 제목", desc: "게시물의 내용이 표시됩니다 일정이상 길어지면 ...", thumb: "🐕" },
];

export default function NoticeBoardPage() {
  const navigate = useNavigate();

  return (
    <div className="nb-wrapper">
      <div className="nb-screen">
        <div className="nb-status" />

        <header className="nb-header">
          <div className="nb-title">게시판</div>

          {/* ✅ 돋보기 아이콘(SVG)로 교체 */}
          <button className="nb-search" aria-label="search" type="button">
            <svg className="nb-search-ico" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.6" />
              <path d="M15.6 15.6L21 21" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="nb-tabs">
          <button className="nb-tab active" type="button">
            전체
          </button>
          <button className="nb-tab" type="button" onClick={() => navigate("/board/done")}>
            완료된 산책
          </button>
        </div>

        <ul className="nb-list">
          {POSTS_ALL.map((p) => (
            <li
              key={p.id}
              className="nb-item"
              onClick={() => navigate(`/board/${p.id}`)}
            >
              <div className="nb-thumb">
                <span className="nb-thumb-ico">{p.thumb}</span>
              </div>
              <div className="nb-body">
                <div className="nb-item-title">{p.title}</div>
                <div className="nb-item-desc">{p.desc}</div>
              </div>
            </li>
          ))}
        </ul>

        {/* 플로팅 + 버튼 (전체에서만) */}
        <button
          type="button"
          className="nb-fab"
          aria-label="create"
          onClick={() => navigate("/board/write")}
        >
          +
        </button>

        <NavBar active="board" />
        <div className="nb-safe" />
      </div>
    </div>
  );
}
