// frontend/src/pages/NoticeboardSearchPage.tsx
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NoticeBoardsearchPage.css";

type Post = {
  id: number;
  title: string;
  desc: string;
  thumb: string; // 🐕 같은 이모지 or 나중에 이미지
};

const POSTS_ALL: Post[] = [
  { id: 1, title: "산책 해주실 분 찾습니다", desc: "소형견 푸들이고 성격은 활발한 편입니다!", thumb: "🐕" },
  { id: 2, title: "강아지와 같이 산책", desc: "게시물의 내용이 표시됩니다 일정이상 길어지면 ...", thumb: "🐕" },
  { id: 3, title: "소형견 산책", desc: "게시물의 내용이 표시됩니다 일정이상 길어지면 ...", thumb: "🐕" },
  { id: 4, title: "산책 잘 해주실 분 합니다", desc: "게시물의 내용이 표시됩니다 일정이상 길어지면 ...", thumb: "🐕" },
  { id: 5, title: "같이 산책 하실 분", desc: "게시물의 내용이 표시됩니다 일정이상 길어지면 ...", thumb: "🐕" },
  { id: 6, title: "산책 메이트 구합니다", desc: "게시물의 내용이 표시됩니다 일정이상 길어지면 ...", thumb: "🐕" },
];

type RecentItem = { id: number; q: string; date: string };

export default function NoticeboardSearchPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [q, setQ] = useState("");
  const [submittedQ, setSubmittedQ] = useState(""); // ✅ 검색 버튼/엔터 눌렀을 때만 결과 반영
  const [recent, setRecent] = useState<RecentItem[]>([
    { id: 1, q: "산책 구합니다", date: mdLabel(new Date()) },
    { id: 2, q: "소형견", date: mdLabel(new Date()) },
    { id: 3, q: "푸들", date: mdLabel(new Date()) },
  ]);

  const results = useMemo(() => {
    const keyword = submittedQ.trim().toLowerCase();
    if (!keyword) return [];
    return POSTS_ALL.filter(
      (p) =>
        p.title.toLowerCase().includes(keyword) ||
        p.desc.toLowerCase().includes(keyword)
    );
  }, [submittedQ]);

  const submitSearch = (keyword: string) => {
    const k = keyword.trim();
    if (!k) return;

    setSubmittedQ(k);

    // ✅ 최근검색어 업데이트(중복 제거 후 맨 위로)
    setRecent((prev) => {
      const filtered = prev.filter((x) => x.q !== k);
      const next: RecentItem = { id: Date.now(), q: k, date: mdLabel(new Date()) };
      return [next, ...filtered].slice(0, 10);
    });
  };

  const clearQuery = () => {
    setQ("");
    setSubmittedQ(""); // ✅ 결과도 닫기
    inputRef.current?.focus();
  };

  const removeRecent = (id: number) => {
    setRecent((prev) => prev.filter((x) => x.id !== id));
  };

  const clearAllRecent = () => setRecent([]);

  return (
    <div className="nbs-wrapper">
      <div className="nbs-screen">
        <div className="nbs-status" />

        {/* 헤더 */}
        <header className="nbs-header">
          <button className="nbs-back" type="button" aria-label="back" onClick={() => navigate(-1)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* 검색바 */}
          <form
            className="nbs-searchbar"
            onSubmit={(e) => {
              e.preventDefault();
              submitSearch(q);
            }}
          >
            {/* ✅ 돋보기 대신 발바닥 */}
            <span className="nbs-paw" aria-hidden>
              🐾
            </span>

            <input
              ref={inputRef}
              className="nbs-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="검색어를 입력하세요"
            />

            {q.trim().length > 0 && (
              <button className="nbs-clear" type="button" aria-label="clear" onClick={clearQuery}>
                ×
              </button>
            )}
          </form>

          <button className="nbs-close" type="button" onClick={() => navigate(-1)}>
            닫기
          </button>
        </header>

        <main className="nbs-body">
          {/* ✅ submittedQ가 없으면 최근검색어, 있으면 결과 리스트 */}
          {!submittedQ && (
            <>
              <div className="nbs-section-head">
                <div className="nbs-section-title">최근 검색어</div>
                <button className="nbs-clearall" type="button" onClick={clearAllRecent}>
                  전체삭제
                </button>
              </div>

              <ul className="nbs-recent">
                {recent.map((r) => (
                  <li key={r.id} className="nbs-recent-item">
                    {/* ⏰ 아이콘 */}
                    <span className="nbs-clock" aria-hidden>
                      🕒
                    </span>

                    <button
                      className="nbs-recent-q"
                      type="button"
                      onClick={() => {
                        setQ(r.q);
                        submitSearch(r.q); // ✅ 최근검색어 클릭하면 바로 결과
                      }}
                    >
                      {r.q}
                    </button>

                    <span className="nbs-recent-time">{r.date}</span>

                    <button className="nbs-recent-x" type="button" aria-label="remove" onClick={() => removeRecent(r.id)}>
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {submittedQ && (
            <section className="nbs-results" aria-label="search results">
              {results.length === 0 ? (
                <div className="nbs-empty">“{submittedQ}” 검색 결과가 없어요.</div>
              ) : (
                <>
                  {results.map((p) => (
                    <div
                      key={p.id}
                      className="nbs-result-item"
                      role="button"
                      tabIndex={0}
                      onClick={() => navigate(`/board/${p.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") navigate(`/board/${p.id}`);
                      }}
                    >
                      <div className="nbs-thumb">{p.thumb}</div>
                      <div className="nbs-rbody">
                        <div className="nbs-rtitle">{p.title}</div>
                        <div className="nbs-rdesc">{p.desc}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function mdLabel(d = new Date()) {
  // 예: 12.22
  return `${d.getMonth() + 1}.${d.getDate()}`;
}
