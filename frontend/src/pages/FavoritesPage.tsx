import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import api from "../api/api";
import "./FavoritesPage.css";

type FavoriteItem = {
  boardId: number;
  title: string;
  description: string;
  location: string;
  viewCount: number;
};

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get("/boards/interests");
        setFavorites(res.data.data ?? []);
      } catch (e) {
        console.error("관심 목록 조회 실패", e);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="sub-wrapper">
      <div className="sub-screen">
        <div className="sub-status" />

        <header className="sub-top">
          <button className="sub-back" onClick={() => navigate(-1)}>
            ‹
          </button>
          <div className="sub-right" />
        </header>

        <div className="sub-section-title">관심 목록</div>

        <ul className="sub-list">
          {loading && <li className="sub-empty">로딩중...</li>}

          {!loading && favorites.length === 0 && (
            <li className="sub-empty">관심 등록한 게시글이 없습니다.</li>
          )}

          {favorites.map((p) => (
            <li
              key={p.boardId}
              className="sub-item"
              onClick={() => navigate(`/board/${p.boardId}`)}
            >
              <div className="sub-thumb">
                <span className="sub-thumb-ico">♥</span>
              </div>

              <div className="sub-text">
                <div className="sub-item-title">{p.title}</div>
                <div className="sub-item-desc">
                  {p.description.length > 40
                    ? p.description.slice(0, 40) + "..."
                    : p.description}
                </div>
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
