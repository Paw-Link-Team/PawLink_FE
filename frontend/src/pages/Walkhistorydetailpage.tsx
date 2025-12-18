import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "./Walkhistorydetailpage.css";

type HistoryCard = {
  id: number;
  date: string; // 2025. 12. 5 (금)
  time: string; // 00:12:32
  distance: string; // 0.82km
  speed: string; // 3.9km/h
};

export default function Walkhistorydetailpage() {
  const nav = useNavigate();

  const HISTORY: HistoryCard[] = useMemo(
    () => [
      { id: 1, date: "2025. 12. 5 (금)", time: "00:12:32", distance: "0.82km", speed: "3.9km/h" },
      { id: 2, date: "2025. 11. 23 (일)", time: "00:23:08", distance: "1.5km", speed: "3.8km/h" },
      { id: 3, date: "2025. 11. 10 (월)", time: "00:10:01", distance: "0.6km", speed: "3.6km/h" },
    ],
    []
  );

  return (
    <div className="wh-root">
      <div className="wh-status" />

      {/* ✅ 상단 헤더: 왼쪽 상단 '<' + 제목(가리지 않게) */}
      <header className="wh-top">
        <button
          type="button"
          className="wh-back"
          aria-label="back"
          onClick={() => nav(-1)}
        >
          {/* '<' 모양 아이콘 */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <h1 className="wh-title">산책 히스토리</h1>
      </header>

      <main className="wh-body">
        {HISTORY.map((h) => (
          <section key={h.id} className="wh-item">
            <div className="wh-date">{h.date}</div>

            <button
              type="button"
              className="wh-card"
              onClick={() => nav(`/mypage/history/${h.id}`)}
            >
              <div className="wh-col">
                <div className="wh-label">산책시간</div>
                <div className="wh-value">{h.time}</div>
              </div>

              <div className="wh-col">
                <div className="wh-label">이동거리</div>
                <div className="wh-value">{h.distance}</div>
              </div>

              <div className="wh-col">
                <div className="wh-label">평균속도</div>
                <div className="wh-value">{h.speed}</div>
              </div>
            </button>
          </section>
        ))}
      </main>

      <NavBar active="mypage" />
      <div className="wh-safe" />
    </div>
  );
}
