// HomePage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import api from "../api/api";
import "./HomePage.css";

/* =====================
 * 타입 정의
 * ===================== */

type RankItem = {
  rank: number;
  userId: number;
  nickname: string;
  totalDistanceKm: number;
  walkCount: number;
};

type Slide =
  | { kind: "photo"; img: string; overlay: string }
  | { kind: "logo"; topLine: string };

/* =====================
 * 정적 리소스
 * ===================== */

const banner1 = new URL("../assets/pawlink-logo.png", import.meta.url).href;
const banner3 = new URL("../assets/pawlink-logo3.png", import.meta.url).href;

/* =====================
 * 컴포넌트
 * ===================== */

export default function HomePage() {
  const navigate = useNavigate();

  /* ===== 상태 ===== */
  const [ranking, setRanking] = useState<RankItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [slideIdx, setSlideIdx] = useState(0);
  const [chipIdx, setChipIdx] = useState(0);

  /* =====================
   * UI 상수
   * ===================== */

  const slides: Slide[] = useMemo(
    () => [
      {
        kind: "photo",
        img: banner1,
        overlay: "우리 강아지와 함께 산책할 동네 친구를 모집해요!",
      },
      {
        kind: "logo",
        topLine: "📣 v2.1 업데이트 : 실시간 산책 유저 지도 오픈",
      },
      {
        kind: "photo",
        img: banner3,
        overlay: "PawLink 제휴로 15% 할인 쿠폰 증정!",
      },
    ],
    []
  );

  const chips = useMemo(
    () => [
      "🐾 산책시 리드줄은 필수예요!",
      "🐾 오늘도 안전한 산책을 응원해요!",
      "🐾 근처 친구들과 함께 산책해봐요!",
    ],
    []
  );

  /* =====================
   * 랭킹 로드
   * ===================== */

  useEffect(() => {
    const loadRanking = async () => {
      try {
        const res = await api.get<RankItem[]>(
          "/api/walkers/rank?size=10"
        );
        console.log("🔴 전체 응답:", res);
        console.log("🟢 랭킹 배열:", res.data);
        setRanking(res.data); // ✅ 핵심
      } catch (e) {
        console.error("❌ 랭킹 로드 실패", e);
      } finally {
        setLoading(false);
      }
    };

    loadRanking();
  }, []);

  /* =====================
   * 배너 / 칩 자동 전환
   * ===================== */

  useEffect(() => {
    const t = setInterval(
      () => setSlideIdx((v) => (v + 1) % slides.length),
      4500
    );
    return () => clearInterval(t);
  }, [slides.length]);

  useEffect(() => {
    const t = setInterval(
      () => setChipIdx((v) => (v + 1) % chips.length),
      3500
    );
    return () => clearInterval(t);
  }, [chips.length]);

  /* =====================
   * 로딩 처리
   * ===================== */

  if (loading) {
    return <div className="hp-loading">로딩 중...</div>;
  }

  const current = slides[slideIdx];

  /* =====================
   * 렌더
   * ===================== */

  return (
    <div className="hp-wrapper">
      <div className="hp-screen">
        <div className="hp-status" />

        {/* 헤더 */}
        <header className="hp-header">
          <div className="hp-logo">PawLink</div>
        </header>

        {/* 배너 */}
        <section className="hp-banner">
          {current.kind === "photo" ? (
            <div
              className="hp-banner-photo"
              style={{ backgroundImage: `url(${current.img})` }}
            >
              <div className="hp-banner-overlay">
                {current.overlay}
              </div>
              <div className="hp-banner-page">
                {slideIdx + 1}/{slides.length}
              </div>
            </div>
          ) : (
            <div className="hp-banner-logo">
              <div className="hp-banner-topline">
                {current.topLine}
              </div>
            </div>
          )}
        </section>

        {/* 말풍선 */}
        <section className="hp-chip-wrap">
          <div className="hp-chip">{chips[chipIdx]}</div>
        </section>

        {/* 랭킹 */}
        <section className="hp-rank">
          <div className="hp-rank-head">
            우리동네 주간 산책랭크
          </div>

          {ranking.length === 0 ? (
            <div style={{ padding: 16 }}>랭킹 데이터가 없습니다.</div>
          ) : (
            <ul className="hp-rank-list">
              {ranking.map((r) => (
                <li key={r.userId} className="hp-rank-item">
                  <button
                    type="button"
                    className="hp-rank-rowbtn"
                    onClick={() =>
                      navigate(`/walkers/${r.userId}`)
                    }
                  >
                    <div className="hp-rank-left">
                      <div className="hp-rank-no">{r.rank}</div>
                      <div className="hp-rank-info">
                        <div className="hp-rank-name">
                          {r.nickname}
                        </div>
                        <div className="hp-rank-meta">
                          산책거리 {r.totalDistanceKm}km ·
                          함께 걸은 강아지 {r.walkCount}마리
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <NavBar active="home" />
        <div className="hp-safe" />
      </div>
    </div>
  );
}
