import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "./FavoritesPage.css";

const DUMMY_FAVORITES = [
  { id: 11, title: "게시글 제목", desc: "(관심) 산책구..." },
  { id: 12, title: "게시글 제목", desc: "(관심) 산책..." },
];

export default function FavoritesPage() {
  const navigate = useNavigate();

  return (
    <div className="sub-wrapper">
      <div className="sub-screen">
        <div className="sub-status" />

        <header className="sub-top">
          <button className="sub-back" onClick={() => navigate(-1)}>
            ‹
          </button>
          <div className="sub-title">관심 목록</div>
          <div className="sub-right" />
        </header>

        <ul className="sub-list">
          {DUMMY_FAVORITES.map((p) => (
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
