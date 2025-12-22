import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "./HomePage.css";

// ✅ 실제 존재하는 이미지 파일명 그대로 사용
const banner1 = new URL("../assets/pawlink-logo.png", import.meta.url).href;
const banner3 = new URL("../assets/pawlink-logo3.png", import.meta.url).href;

type RankItem = {
  id: number;
  name: string;
  distance: string;
  dogs: string;
};

type Slide =
  | { kind: "photo"; img: string; overlay: string }
  | { kind: "logo"; topLine: string };

export default function HomePage() {
  const navigate = useNavigate();

  const RANKING_DATA: RankItem[] = useMemo(
    () => [
      { id: 1, name: "예림팀장님", distance: "산책거리 15km", dogs: "함께 걸은 강아지 25마리" },
      { id: 2, name: "마요최고", distance: "산책거리 12km", dogs: "함께 걸은 강아지 21마리" },
      { id: 3, name: "모르는마요산책", distance: "산책거리 9km", dogs: "함께 걸은 강아지 18마리" },
      { id: 4, name: "보리보리쌀", distance: "산책거리 7km", dogs: "함께 걸은 강아지 15마리" },
    ],
    []
  );

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

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((v) => (v + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, [slides.length]);

  const current = slides[idx];

  // ✅ 랭킹 클릭 시 WalkerProfile로 이동
  const goWalkerProfile = (rankId: number) => {
    // 지금 WalkerProfile이 정적 페이지면 그냥 이동만
    // 나중에 유저별 프로필로 확장하면 /walker-profile/:id 로 바꾸면 됨
    navigate("/walker-profile", { state: { fromRankId: rankId } });
  };

  return (
    <div className="hp-wrapper">
      <div className="hp-screen">
        <div className="hp-status" />

        {/* 헤더 */}
        <header className="hp-header">
          <div className="hp-logo">PawLink</div>

          <button className="hp-loc" type="button" aria-label="map">
            <svg className="hp-loc-pin" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 2C7.86 2 4.5 5.36 4.5 9.5c0 5.25 7.5 12.5 7.5 12.5s7.5-7.25 7.5-12.5C19.5 5.36 16.14 2 12 2z"
                fill="currentColor"
              />
              <circle cx="12" cy="9.5" r="2.6" fill="#ffffff" />
            </svg>
          </button>
        </header>

        {/* 배너 */}
        <section className="hp-banner">
          {current.kind === "photo" ? (
            <div
              className="hp-banner-photo"
              style={{ backgroundImage: `url(${current.img})` }}
            >
              <div className="hp-banner-overlay">{current.overlay}</div>
              <div className="hp-banner-page">{idx + 1}/3</div>

              <div className="hp-dots">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    className={`hp-dot ${i === idx ? "on" : ""}`}
                    onClick={() => setIdx(i)}
                    type="button"
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="hp-banner-logo">
              <div className="hp-banner-topline">{current.topLine}</div>

              <div className="hp-brand">
                <div className="hp-brand-paw">🐾</div>
                <div className="hp-brand-text">PawLink</div>
              </div>

              <div className="hp-banner-page">{idx + 1}/3</div>
              <div className="hp-dots">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    className={`hp-dot ${i === idx ? "on" : ""}`}
                    onClick={() => setIdx(i)}
                    type="button"
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 말풍선 */}
        <section className="hp-chip-wrap">
          <div className="hp-chip">🐾 산책시 리드줄은 필수예요!</div>
        </section>

        {/* 랭킹 */}
        <section className="hp-rank">
          <div className="hp-rank-head">우리동네 주간 산책랭크</div>

          <ul className="hp-rank-list">
            {RANKING_DATA.map((r) => (
              <li key={r.id} className="hp-rank-item">
                {/* ✅ li 전체를 버튼으로 만들어 “칸 클릭”이 되게 */}
                <button
                  type="button"
                  className="hp-rank-rowbtn"
                  onClick={() => goWalkerProfile(r.id)}
                  aria-label={`${r.name} 산책자 프로필 보기`}
                >
                  <div className="hp-rank-left">
                    <div className="hp-rank-no">{r.id}</div>
                    <div className="hp-rank-info">
                      <div className="hp-rank-name">{r.name}</div>
                      <div className="hp-rank-meta">
                        {r.distance} / {r.dogs}
                      </div>
                    </div>
                  </div>

                  <div className="hp-rank-paw" aria-hidden="true">
                    <svg
                      className="hp-rank-paw-ico"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle cx="7.3" cy="8.4" r="2.0" />
                      <circle cx="12" cy="6.9" r="2.1" />
                      <circle cx="16.7" cy="8.4" r="2.0" />
                      <circle cx="19.1" cy="11.6" r="1.85" />
                      <path d="M6.2 16.4c0-3.0 2.9-5.3 5.8-5.3s5.8 2.3 5.8 5.3c0 2.5-2.2 4.6-5.8 4.6s-5.8-2.1-5.8-4.6z" />
                    </svg>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <NavBar active="home" />
        <div className="hp-safe" />
      </div>
    </div>
  );
}