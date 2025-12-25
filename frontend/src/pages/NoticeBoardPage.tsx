// frontend/src/pages/NoticeBoardPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import api from "../api/api";
import "./NoticeBoardPage.css";

type BoardItem = {
  id: number;
  title: string;
  description: string;
  location: string;
  walkTime: string | null;
  walkTimeType: "FIXED" | "FLEXIBLE" | "UNDECIDED";
  viewCount: number;
  userId: number;
  userNickname: string;
  interested: boolean;
  interestCount: number;
};

export default function NoticeBoardPage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<BoardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await api.get("/boards");
      setPosts(res.data?.data ?? []);
    } catch (e) {
      console.error("게시판 조회 실패", e);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const goSearch = () => {
    navigate("/board/search");
  };

  return (
    <div className="nb-wrapper">
      <div className="nb-screen">
        <div className="nb-status" />

        {/* ===== Header ===== */}
        <header className="nb-header">
          <div className="nb-title">게시판</div>

          <button
            className="nb-search"
            type="button"
            aria-label="search"
            onClick={goSearch}
          >
            <svg className="nb-search-ico" viewBox="0 0 24 24">
              <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.6" />
              <path d="M15.6 15.6L21 21" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {/* ===== Tabs ===== */}
        <div className="nb-tabs">
          <button className="nb-tab active" type="button">
            전체
          </button>
          <button
            className="nb-tab"
            type="button"
            onClick={() => navigate("/board/done")}
          >
            완료된 산책
          </button>
        </div>

        {/* ===== List ===== */}
        <ul className="nb-list">
          {loading && <li className="nb-empty">로딩중...</li>}

          {!loading && posts.length === 0 && (
            <div className="nb-empty">
              <div className="nb-empty-title">
                아직 등록된 산책 글이 없어요 🐾
              </div>
              <div className="nb-empty-desc">
                첫 산책 글을 작성해보세요!
              </div>
            </div>
          )}

          {!loading &&
            posts.map((p) => (
              <li
                key={p.id}
                className="nb-item"
                onClick={() => navigate(`/board/${p.id}`)}
              >
                <div className="nb-thumb">
                  <span className="nb-thumb-ico">🐕</span>
                </div>

                <div className="nb-body">
                  <div className="nb-item-title">{p.title}</div>

                  <div className="nb-item-desc">
                    {p.description.length > 40
                      ? `${p.description.slice(0, 40)}...`
                      : p.description}
                  </div>

                  <div className="nb-item-meta">
                    {p.location} · 조회 {p.viewCount}
                  </div>
                </div>
              </li>
            ))}
        </ul>

        {/* ===== Floating Button ===== */}
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
