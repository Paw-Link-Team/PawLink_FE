// frontend/src/pages/NoticeBoardPage.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NoticeBoardPage.css";

type Post = {
  id: number;
  title: string;
  desc: string;
  completed: boolean;

  // 상세 화면용(더미)
  authorName?: string;
  distanceText?: string;
  walkTimeText?: string;
  walkPlaceText?: string;
  detailText?: string;
  viewCount?: number;
  chatCount?: number;
  likeCount?: number;
};

export default function NoticeBoardPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"all" | "done">("all");

  const posts: Post[] = [
    {
      id: 1,
      title: "산책 해주실 분 찾습니다",
      desc: "소형견 푸들이고 성격은 활발한 편 입니다!",
      completed: false,
      authorName: "강형욱",
      distanceText: "오류동 0.8km",
      walkTimeText: "산책시간 30분",
      walkPlaceText: "산책장소 오류동 함동수목원",
      detailText:
        "상세 내용\n강아지 견종\n강아지 성격 등 강아지에 관한 정보를 자유롭게 기재 가능한 칸",
      viewCount: 101,
      chatCount: 2,
      likeCount: 0,
    },
    {
      id: 2,
      title: "게시물 제목",
      desc: "게시물의 내용이 표시됩니다 일정이상 길어지면...",
      completed: false,
    },
    {
      id: 3,
      title: "게시물 제목",
      desc: "게시물의 내용이 표시됩니다 일정이상 길어지면...",
      completed: false,
    },
    {
      id: 4,
      title: "게시물 제목",
      desc: "게시물의 내용이 표시됩니다 일정이상 길어지면...",
      completed: false,
    },
    {
      id: 5,
      title: "게시물 제목",
      desc: "게시물의 내용이 표시됩니다 일정이상 길어지면...",
      completed: false,
    },
    {
      id: 6,
      title: "게시물 제목",
      desc: "게시물의 내용이 표시됩니다 일정이상 길어지면...",
      completed: false,
    },

    // 완료된 산책 탭에서 보일 더미
    {
      id: 101,
      title: "게시물 제목",
      desc: "게시물의 내용이 표시됩니다 일정이상 길어지면...",
      completed: true,
    },
    {
      id: 102,
      title: "게시물 제목",
      desc: "게시물의 내용이 표시됩니다 일정이상 길어지면...",
      completed: true,
    },
    {
      id: 103,
      title: "게시물 제목",
      desc: "게시물의 내용이 표시됩니다 일정이상 길어지면...",
      completed: true,
    },
    {
      id: 104,
      title: "게시물 제목",
      desc: "게시물의 내용이 표시됩니다 일정이상 길어지면...",
      completed: true,
    },
    {
      id: 105,
      title: "게시물 제목",
      desc: "게시물의 내용이 표시됩니다 일정이상 길어지면...",
      completed: true,
    },
  ];

  const visiblePosts = useMemo(() => {
    if (tab === "all") return posts.filter((p) => !p.completed);
    return posts.filter((p) => p.completed);
  }, [tab]);

  const goDetail = (id: number) => {
    navigate(`/board/${id}`);
  };

  return (
    <div className={`nb-root ${tab === "done" ? "nb-done-bg" : ""}`}>
      <div className="nb-phone">
        {/* 상단 헤더 */}
        <header className="nb-header">
          <div className="nb-title">게시판</div>

          <button className="nb-search-btn" aria-label="search" type="button">
            {/* 돋보기 아이콘(간단 SVG) */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M10.5 19a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M20 20l-3.5-3.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        {/* 탭 */}
        <div className="nb-tabs">
          <button
            className={`nb-tab ${tab === "all" ? "active" : ""}`}
            onClick={() => setTab("all")}
            type="button"
          >
            전체
          </button>
          <button
            className={`nb-tab ${tab === "done" ? "active" : ""}`}
            onClick={() => setTab("done")}
            type="button"
          >
            완료된 산책
          </button>
        </div>

        {/* 리스트 */}
        <main className="nb-list">
          {visiblePosts.map((p) => (
            <div
              key={p.id}
              className="nb-item"
              role="button"
              tabIndex={0}
              onClick={() => goDetail(p.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") goDetail(p.id);
              }}
            >
              <div className="nb-thumb" aria-hidden />
              <div className="nb-item-text">
                <div className="nb-item-title">{p.title}</div>
                <div className="nb-item-desc">{p.desc}</div>
              </div>
            </div>
          ))}
        </main>

        {/* 플로팅 + 버튼(전체 탭에서만 보이게) */}
        {tab === "all" && (
          <button
            className="nb-fab"
            aria-label="add"
            type="button"
            onClick={() => alert("글쓰기(추후 연결)")}
          >
            +
          </button>
        )}

        {/* 하단 네브(일단 모양만) */}
        <nav className="nb-nav">
          <div className="nb-nav-item" role="button" tabIndex={0}>
            <div className="nb-nav-ico">⌂</div>
            <div className="nb-nav-txt">홈</div>
          </div>

          <div className="nb-nav-item active" role="button" tabIndex={0}>
            <div className="nb-nav-ico">▣</div>
            <div className="nb-nav-txt">게시판</div>
          </div>

          <div className="nb-nav-item" role="button" tabIndex={0}>
            <div className="nb-nav-ico">💬</div>
            <div className="nb-nav-txt">채팅</div>
          </div>

          <div className="nb-nav-item" role="button" tabIndex={0}>
            <div className="nb-nav-ico">👤</div>
            <div className="nb-nav-txt">마이페이지</div>
          </div>
        </nav>

        <div className="nb-home-indicator" />
      </div>
    </div>
  );
}
