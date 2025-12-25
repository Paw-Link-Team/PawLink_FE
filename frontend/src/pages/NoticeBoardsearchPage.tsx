// frontend/src/pages/NoticeboardSearchPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./NoticeBoardsearchPage.css";

type SearchBoardItem = {
  boardId: number;
  title: string;
  location: string;
  walkTimeType: string;
};

type SearchHistoryItem = {
  id: number;
  keyword: string;
  searchedAt: string;
};

export default function NoticeboardSearchPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [q, setQ] = useState("");
  const [submittedQ, setSubmittedQ] = useState("");

  const [recent, setRecent] = useState<SearchHistoryItem[]>([]);
  const [results, setResults] = useState<SearchBoardItem[]>([]);
  const [loading, setLoading] = useState(false);

  /* =====================
   * 최근 검색어 조회
   * ===================== */
  useEffect(() => {
    api
      .get("/api/search/history")
      .then((res) => setRecent(res.data.data))
      .catch(() => setRecent([]));
  }, []);

  /* =====================
   * 검색 실행
   * ===================== */
  const submitSearch = async (keyword: string) => {
    const k = keyword.trim();
    if (!k) return;

    setSubmittedQ(k);
    setLoading(true);

    try {
      const res = await api.get("/api/search", {
        params: { keyword: k },
      });

      setResults(res.data.data.boards);

      // 🔥 검색 후 최근 검색어 다시 조회 (서버 기준)
      const historyRes = await api.get("/api/search/history");
      setRecent(historyRes.data.data);
    } finally {
      setLoading(false);
    }
  };

  /* =====================
   * 최근 검색어 삭제
   * ===================== */
  const removeRecent = async (id: number) => {
    await api.delete(`/api/search/history/${id}`);
    setRecent((prev) => prev.filter((x) => x.id !== id));
  };

  const clearAllRecent = async () => {
    await api.delete("/api/search/history");
    setRecent([]);
  };

  const clearQuery = () => {
    setQ("");
    setSubmittedQ("");
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div className="nbs-wrapper">
      <div className="nbs-screen">
        <div className="nbs-status" />

        {/* 헤더 */}
        <header className="nbs-header">
          <button
            className="nbs-back"
            type="button"
            aria-label="back"
            onClick={() => navigate(-1)}
          >
            ←
          </button>

          {/* 검색바 */}
          <form
            className="nbs-searchbar"
            onSubmit={(e) => {
              e.preventDefault();
              submitSearch(q);
            }}
          >
            <span className="nbs-paw">🐾</span>

            <input
              ref={inputRef}
              className="nbs-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="검색어를 입력하세요"
            />

            {q && (
              <button
                className="nbs-clear"
                type="button"
                onClick={clearQuery}
              >
                ×
              </button>
            )}
          </form>

          <button className="nbs-close" onClick={() => navigate(-1)}>
            닫기
          </button>
        </header>

        <main className="nbs-body">
          {!submittedQ && (
            <>
              <div className="nbs-section-head">
                <div className="nbs-section-title">최근 검색어</div>
                <button
                  className="nbs-clearall"
                  onClick={clearAllRecent}
                >
                  전체삭제
                </button>
              </div>

              <ul className="nbs-recent">
                {recent.map((r) => (
                  <li key={r.id} className="nbs-recent-item">
                    <span className="nbs-clock">🕒</span>

                    <button
                      className="nbs-recent-q"
                      onClick={() => {
                        setQ(r.keyword);
                        submitSearch(r.keyword);
                      }}
                    >
                      {r.keyword}
                    </button>

                    <span className="nbs-recent-time">
                      {formatDate(r.searchedAt)}
                    </span>

                    <button
                      className="nbs-recent-x"
                      onClick={() => removeRecent(r.id)}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {submittedQ && (
            <section className="nbs-results">
              {loading ? (
                <div className="nbs-empty">검색 중...</div>
              ) : results.length === 0 ? (
                <div className="nbs-empty">
                  “{submittedQ}” 검색 결과가 없어요.
                </div>
              ) : (
                results.map((p) => (
                  <div
                    key={p.boardId}
                    className="nbs-result-item"
                    onClick={() =>
                      navigate(`/board/${p.boardId}`)
                    }
                  >
                    <div className="nbs-thumb">🐕</div>
                    <div className="nbs-rbody">
                      <div className="nbs-rtitle">{p.title}</div>
                      <div className="nbs-rdesc">
                        {p.location} · {p.walkTimeType}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}.${d.getDate()}`;
}
