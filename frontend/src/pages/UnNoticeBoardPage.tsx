import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import api from "../api/api";
import { getMyUserId } from "../utils/auth";
import "./UnNoticeBoardPage.css";

/* =====================
 * 타입
 * ===================== */

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

  /* =====================
   * 상태
   * ===================== */
  const [posts, setPosts] = useState<BoardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  /* =====================
   * 로그인 유저 ID
   * ===================== */
  const myUserId = getMyUserId();

  /* =====================
   * 완료된 게시글 조회
   * ===================== */
  useEffect(() => {
    fetchCompletedBoards();
  }, []);

  const fetchCompletedBoards = async () => {
    try {
      const res = await api.get("/boards/completed");
      setPosts(res.data?.data ?? []);
    } catch (e) {
      console.error("완료된 산책 조회 실패", e);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  /* =====================
   * 액션
   * ===================== */

  const toggleMenu = (id: number) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const deletePost = async (id: number) => {
    if (!confirm("완료된 산책 글을 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/boards/${id}`);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setOpenMenuId(null);
    } catch (e) {
      alert("삭제에 실패했습니다.");
    }
  };

  /* =====================
   * 렌더
   * ===================== */

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
            {loading && (
              <li className="unb-empty">로딩중...</li>
            )}

            {!loading && posts.length === 0 && (
              <li className="unb-empty">
                <div className="unb-empty-title">
                  아직 완료된 산책이 없어요
                </div>
                <div className="unb-empty-desc">
                  산책이 끝나면 이곳에서 확인할 수 있어요 🐾
                </div>
              </li>
            )}

            {!loading &&
              posts.map((p) => {
                const isMine =
                  myUserId !== null &&
                  myUserId === p.userId;

                return (
                  <li
                    key={p.id}
                    className="unb-item"
                    onClick={() =>
                      navigate(`/board/${p.id}`)
                    }
                  >
                    <div className="unb-thumb">
                      <span className="unb-thumb-ico">🐕</span>
                    </div>

                    <div className="unb-body">
                      {/* 제목 + 더보기 */}
                      <div className="unb-item-head">
                        <div className="unb-item-title">
                          {p.title}
                        </div>

                        {isMine && (
                          <button
                            className="unb-more"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMenu(p.id);
                            }}
                          >
                            ⋮
                          </button>
                        )}
                      </div>

                      <div className="unb-item-desc">
                        {p.description.length > 40
                          ? `${p.description.slice(
                              0,
                              40
                            )}...`
                          : p.description}
                      </div>

                      <div className="unb-item-meta">
                        {p.location} · 조회 {p.viewCount}
                      </div>

                      {/* 더보기 메뉴 */}
                      {openMenuId === p.id && (
                        <div
                          className="unb-menu"
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                        >
                          <button
                            className="danger"
                            onClick={() =>
                              deletePost(p.id)
                            }
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>

        {/* ===== Bottom Nav ===== */}
        <NavBar active="board" />
        <div className="unb-safe" />
      </div>
    </div>
  );
}
