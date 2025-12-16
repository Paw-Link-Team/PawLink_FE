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
    <div
      className="home-screen-wrapper"
      style={{
        minHeight: "100vh",
        backgroundColor: "#FFF7E9",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        className="home-screen"
        style={{
          width: "100%",
          maxWidth: "390px",
          backgroundColor: "#FFFFFF",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        {/* 상태바 여백 */}
        <div style={{ height: "24px" }} />

        {/* 헤더 */}
        <header className="home-header">
          <div className="home-logo">PawLink</div>
          <div className="home-location">📍</div>
        </header>

        {/* 상단 베이지 영역 */}
        <section
          className="home-hero"
          style={{
            height: "160px",
            backgroundColor: "#F2E3D3",
          }}
        />

        {/* 말풍선 */}
        <section className="home-chip-wrap">
          <div className="home-chip">
            <span>🐾 산책시 리드줄은 필수예요!</span>
          </div>
        </section>

        {/* 주간 랭킹 */}
        <section className="home-ranking">
          <div className="home-ranking-header">우리동네 주간 산책랭크</div>

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
        <NavBar active="home"></NavBar>
        
        {/* 안전 패딩 */}
        <div style={{ height: "72px" }} />
      </div>
    </div>
  );
}

