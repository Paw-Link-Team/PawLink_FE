import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import api from "../api/api";
import { getMyUserId } from "../utils/auth";
import "./NoticeBoardPage.css";

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

export default function NoticeBoardPage() {
  const navigate = useNavigate();

  /* =====================
   * 상태
   * ===================== */
  const [posts, setPosts] = useState<BoardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  /* =====================
   * 로그인 유저 ID (JWT)
   * ===================== */
  const myUserId = useMemo(() => getMyUserId(), []);

  /* =====================
   * 게시글 조회
   * ===================== */
  const fetchBoards = useCallback(async () => {
    try {
      const res = await api.get("/boards");
      setPosts(res.data?.data ?? []);
    } catch (e) {
      console.error("게시판 조회 실패", e);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  /* =====================
   * 액션
   * ===================== */
  const goSearch = useCallback(() => {
    navigate("/board/search");
  }, [navigate]);

  const toggleMenu = useCallback((id: number) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  }, []);

  const deletePost = useCallback(
    async (id: number) => {
      if (!confirm("정말 삭제하시겠습니까?")) return;

      try {
        await api.delete(`/boards/${id}`);
        setPosts((prev) => prev.filter((p) => p.id !== id));
        setOpenMenuId(null);
      } catch (e) {
        alert("삭제에 실패했습니다.");
      }
    },
    []
  );

  /* =====================
   * 렌더 헬퍼
   * ===================== */
  const renderPostItem = (post: BoardItem) => {
    const isMine =
      myUserId !== null && myUserId === post.userId;

    return (
      <li
        key={post.id}
        className="nb-item"
        onClick={() => navigate(`/board/${post.id}`)}
      >
        <div className="nb-thumb">🐕</div>

        <div className="nb-body">
          <div className="nb-item-head">
            <div className="nb-item-title">
              {post.title}
            </div>

            {isMine && (
              <button
                className="nb-more"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMenu(post.id);
                }}
              >
                ⋮
              </button>
            )}
          </div>

          <div className="nb-item-desc">
            {post.description.length > 40
              ? `${post.description.slice(0, 40)}...`
              : post.description}
          </div>

          <div className="nb-item-meta">
            {post.location} · 조회 {post.viewCount}
          </div>

          {openMenuId === post.id && (
            <div
              className="nb-menu"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() =>
                  navigate(`/board/edit/${post.id}`)
                }
              >
                수정
              </button>
              <button
                className="danger"
                onClick={() => deletePost(post.id)}
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </li>
    );
  };

  /* =====================
   * 렌더
   * ===================== */
  return (
    <div className="nb-wrapper">
      <div className="nb-screen">
        <div className="nb-status" />

        {/* Header */}
        <header className="nb-header">
          <div className="nb-title">게시판</div>
          <button
            className="nb-search"
            onClick={goSearch}
            aria-label="search"
          >
            🔍
          </button>
        </header>

        {/* Tabs */}
        <div className="nb-tabs">
          <button className="nb-tab active">전체</button>
          <button
            className="nb-tab"
            onClick={() => navigate("/board/done")}
          >
            완료된 산책
          </button>
        </div>

        {/* List */}
        <ul className="nb-list">
          {loading && (
            <li className="nb-empty">로딩중...</li>
          )}

          {!loading && posts.length === 0 && (
            <li className="nb-empty">
              <div className="nb-empty-title">
                아직 등록된 산책 글이 없어요
              </div>
              <div className="nb-empty-desc">
                첫 산책 글을 작성해보세요!
              </div>
            </li>
          )}

          {!loading && posts.map(renderPostItem)}
        </ul>

        {/* FAB */}
        <button
          className="nb-fab"
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
