import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "./MyPostsPage.css";

const DUMMY_POSTS = [
  { id: 1, title: "게시글 제목", desc: "(마감) 산책구..." },
  { id: 2, title: "게시글 제목", desc: "(진행중) 산책..." },
  { id: 3, title: "게시글 제목", desc: "(완료) 산책..." },
];

export default function MyPostsPage() {
  const navigate = useNavigate();

  return (
    <div className="sub-wrapper">
      <div className="sub-screen">
        <div className="sub-status" />

        <header className="sub-top">
          <button className="sub-back" onClick={() => navigate(-1)}>
            ‹
          </button>
          <div className="sub-title">내가 올린 게시글</div>
          <div className="sub-right" />
        </header>

        <ul className="sub-list">
          {DUMMY_POSTS.map((p) => (
            <li key={p.id} className="sub-item" onClick={() => navigate(`/board/${p.id}`)}>
              <div className="sub-thumb" />
              <div className="sub-text">
                <div className="sub-item-title">{p.title}</div>
                <div className="sub-item-desc">{p.desc}</div>
              </div>
              <div className="sub-chevron">›</div>
            </li>
          ))}
        </ul>

        <NavBar active="mypage" />
        <div className="sub-safe" />
      </div>
    </div>
  );
}
