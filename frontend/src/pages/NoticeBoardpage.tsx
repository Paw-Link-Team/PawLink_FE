import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "./NoticeBoardpage.css";

const POSTS_ALL = [
  {
    id: 1,
    title: "산책 해주실 분 찾습니다",
    desc: "소형견 푸들이고 성격은 활발한 편입니다!",
    thumb: "🐕",
  },
  {
    id: 2,
    title: "게시물 제목",
    desc: "게시물의 내용이 표시됩니다 일정이상 길어지면 ...",
    thumb: "🐕",
  },
  {
    id: 3,
    title: "게시물 제목",
    desc: "게시물의 내용이 표시됩니다 일정이상 길어지면 ...",
    thumb: "🐕",
  },
  {
    id: 4,
    title: "게시물 제목",
    desc: "게시물의 내용이 표시됩니다 일정이상 길어지면 ...",
    thumb: "🐕",
  },
  {
    id: 5,
    title: "게시물 제목",
    desc: "게시물의 내용이 표시됩니다 일정이상 길어지면 ...",
    thumb: "🐕",
  },
];

export default function NoticeBoardPage() {
  const navigate = useNavigate();

  return (
    <div className="nb-wrapper">
      <div className="nb-screen">
        <div className="nb-status" />

        {/* 헤더 */}
        <header className="nb-header">
          <div className="nb-title">게시판</div>
          <button className="nb-search" aria-label="search">
            🔍
          </button>
        </header>

        {/* 탭 */}
        <div className="nb-tabs">
          <button className="nb-tab active">전체</button>
          <button className="nb-tab" onClick={() => navigate("/board/done")}>
            완료된 산책
          </button>
        </div>

        {/* 리스트 */}
        <ul className="nb-list">
          {POSTS_ALL.map((p) => (
            <li
              key={p.id}
              className="nb-item"
              onClick={() => navigate(`/board/${p.id}`)} // 나중에 상세 만들면 사용
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
