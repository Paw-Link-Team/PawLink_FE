import { useEffect, useMemo, useState } from "react";
import NavBar from "../components/NavBar";
import "./HomePage.css";

// ✅ 실제 존재하는 이미지 파일명 그대로 사용
const banner1 = new URL("../assets/paw_HomePage2.png", import.meta.url).href;
const banner3 = new URL("../assets/paw_HomePage1.png", import.meta.url).href;

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
  const RANKING_DATA: RankItem[] = useMemo(
    () => [
      { id: 1, name: "강형욱", distance: "산책거리 15km", dogs: "함께 걸은 강아지 25마리" },
      { id: 2, name: "우리초코가계에빠", distance: "산책거리 12km", dogs: "함께 걸은 강아지 21마리" },
      { id: 3, name: "모르는개산책", distance: "산책거리 9km", dogs: "함께 걸은 강아지 18마리" },
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

  return (
    <div className="hp-wrapper">
      <div className="hp-screen">
        <div className="hp-status" />

        {/* 헤더 */}
        <header className="hp-header">
          <div className="hp-logo">PawLink</div>
          <button className="hp-loc" type="button">📍</button>
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
                <div className="hp-rank-left">
                  <div className="hp-rank-no">{r.id}</div>
                  <div className="hp-rank-info">
                    <div className="hp-rank-name">{r.name}</div>
                    <div className="hp-rank-meta">
                      {r.distance} / {r.dogs}
                    </div>
                  </div>
                </div>

                <button className="hp-rank-paw" type="button">🐾</button>
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
