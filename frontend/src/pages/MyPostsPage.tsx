import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import api from "../api/api";
import "./MyPostsPage.css";

type MyPostItem = {
  boardId: number;
  title: string;
  description: string;
  status: "OPEN" | "COMPLETED";
};

export default function MyPostsPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<MyPostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await api.get("/boards/me");
        setPosts(res.data.data ?? []);
      } catch (e) {
        console.error("내 게시글 조회 실패", e);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  const renderStatusText = (status: MyPostItem["status"]) => {
    if (status === "COMPLETED") return "(완료)";
    return "(진행중)";
  };

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

        <div className="sub-section-title">내가 올린 게시글</div>

        <ul className="sub-list">
          {loading && <li className="sub-empty">로딩중...</li>}

          {!loading && posts.length === 0 && (
            <li className="sub-empty">작성한 게시글이 없습니다.</li>
          )}

          {posts.map((p) => (
            <li
              key={p.boardId}
              className="sub-item"
              onClick={() => navigate(`/board/${p.boardId}`)}
            >
              <div className="sub-thumb" />
              <div className="sub-text">
                <div className="sub-item-title">{p.title}</div>
                <div className="sub-item-desc">
                  {renderStatusText(p.status)}{" "}
                  {p.description.length > 30
                    ? p.description.slice(0, 30) + "..."
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
