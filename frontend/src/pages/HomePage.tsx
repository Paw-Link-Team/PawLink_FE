import "../App.css";
import NavBar from "../components/NavBar";

const RANKING_DATA = [
  {
    id: 1,
    name: "강정욱",
    distance: "산책거리 15km",
    dogs: "함께 걷은 강아지 25마리",
  },
  {
    id: 2,
    name: "우리초코가계에빠",
    distance: "산책거리 12km",
    dogs: "함께 걷은 강아지 21마리",
  },
  {
    id: 3,
    name: "모르는개산책",
    distance: "산책거리 9km",
    dogs: "함께 걷은 강아지 18마리",
  },
  {
    id: 4,
    name: "보리보리쌀",
    distance: "산책거리 7km",
    dogs: "함께 걷은 강아지 15마리",
  },
];

export default function HomePage() {
  return (
    <div className="hp-wrapper">
      <div className="hp-screen">
        <div className="hp-status" />

        {/* 헤더 */}
        <header className="home-header">
          <div className="home-logo">PawLink</div>
          <div className="home-location">📍</div>
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

          <ul className="home-ranking-list">
            {RANKING_DATA.map((item) => (
              <li key={item.id} className="home-ranking-item">
                <div>
                  <strong>
                    {item.id}. {item.name}
                  </strong>
                  <div style={{ fontSize: "13px", opacity: 0.7 }}>
                    {item.distance} | {item.dogs}
                  </div>
                </div>

                <div className="home-ranking-avatar">👤</div>
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
