// frontend/src/pages/UnNoticeBoardPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import api from "../api/api";
import "./UnNoticeBoardPage.css";

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

export default function UnNoticeBoardPage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<BoardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletedBoards();
  }, []);

  const fetchCompletedBoards = async () => {
    try {
      // ✅ 핵심 수정 포인트
      const res = await api.get("/boards/completed");
      setPosts(res.data?.data ?? []);
    } catch (e) {
      console.error("완료된 산책 조회 실패", e);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="unb-wrapper">
      <div className="unb-screen">
        <div className="unb-status" />

        {/* ===== Header ===== */}
        <header className="unb-header">
          <div className="unb-title">게시판</div>

          <button
            className="unb-search"
            aria-label="search"
            type="button"
            onClick={() => navigate("/board/search")}
          >
            <svg className="unb-search-ico" viewBox="0 0 24 24">
              <circle
                cx="10.5"
                cy="10.5"
                r="6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
              />
              <path
                d="M15.6 15.6L21 21"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        {/* ===== Tabs ===== */}
        <div className="unb-tabs">
          <button
            className="unb-tab"
            type="button"
            onClick={() => navigate("/board")}
          >
            전체
          </button>
          <button className="unb-tab active" type="button">
            완료된 산책
          </button>
        </div>

        {/* ===== Completed List ===== */}
        <div className="unb-dim-area">
          <ul className="unb-list">
            {loading && <li className="unb-empty">로딩중...</li>}

            {!loading && posts.length === 0 && (
              <div className="unb-empty">
                <div className="unb-empty-title">
                  아직 완료된 산책이 없어요
                </div>
                <div className="unb-empty-desc">
                  산책이 끝나면 이곳에서 확인할 수 있어요 🐾
                </div>
              </div>
            )}

            {!loading &&
              posts.map((p) => (
                <li
                  key={p.id}
                  className="unb-item"
                  onClick={() => navigate(`/board/${p.id}`)}
                >
                  <div className="unb-thumb">
                    <span className="unb-thumb-ico">🐕</span>
                  </div>

                  <div className="unb-body">
                    <div className="unb-item-title">{p.title}</div>
                    <div className="unb-item-desc">
                      {p.description.length > 40
                        ? `${p.description.slice(0, 40)}...`
                        : p.description}
                    </div>

                    <div className="unb-item-meta">
                      {p.location} · 조회 {p.viewCount}
                    </div>
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
