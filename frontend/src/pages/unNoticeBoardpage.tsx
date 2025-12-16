import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "./unNoticeBoardpage.css";

const DONE_POSTS = [
  {
    id: 101,
    title: "게시물 제목",
    desc: "게시물의 내용이 표시됩니다 일정이상 길어지면...",
  },
  {
    id: 102,
    title: "게시물 제목",
    desc: "게시물의 내용이 표시됩니다 일정이상 길어지면...",
  },
  {
    id: 103,
    title: "게시물 제목",
    desc: "게시물의 내용이 표시됩니다 일정이상 길어지면...",
  },
  {
    id: 104,
    title: "게시물 제목",
    desc: "게시물의 내용이 표시됩니다 일정이상 길어지면...",
  },
  {
    id: 105,
    title: "게시물 제목",
    desc: "게시물의 내용이 표시됩니다 일정이상 길어지면...",
  },
];

export default function UnNoticeBoardPage() {
  const navigate = useNavigate();

  return (
    <div className="unb-wrapper">
      <div className="unb-screen">
        <div className="unb-status" />

        {/* 헤더 */}
        <header className="unb-header">
          <div className="unb-title">게시판</div>
          <button className="unb-search" aria-label="search">
            🔍
          </button>
        </header>

        {/* 탭 */}
        <div className="unb-tabs">
          <button className="unb-tab" onClick={() => navigate("/board")}>
            전체
          </button>
          <button className="unb-tab active">완료된 산책</button>
        </div>

        {/* ✅ 완료된 산책 톤다운 배경 영역 */}
        <div className="unb-dim-area">
          <ul className="unb-list">
            {DONE_POSTS.map((p) => (
              <li key={p.id} className="unb-item">
                <div className="unb-thumb">
                  <span className="unb-thumb-ico">🐕</span>
                </div>

                <div className="unb-body">
                  <div className="unb-item-title">{p.title}</div>
                  <div className="unb-item-desc">{p.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <NavBar active="board" />
        <div className="unb-safe" />
      </div>
    </div>
  );
}
