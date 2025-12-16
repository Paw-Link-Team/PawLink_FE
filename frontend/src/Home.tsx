import React from "react";
import "./Home.css";


type RankItem = {
  id: number;
  name: string;
  distance: string;
  dogs: string;
};

const RANKING_DATA: RankItem[] = [
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

// 리스트 오른쪽에 들어가는 유저 아이콘 (브라운 원 + 흰색 아이콘)
const UserIcon: React.FC = () => (
  <svg
    className="home-ranking-avatar-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle cx="12" cy="9" r="4" />
    <path d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6" />
  </svg>
);

const Home: React.FC = () => {
  return (
    <div className="home-screen-wrapper">
      <div className="home-screen">
        {/* 상태바 여백 */}
        <div className="home-status-bar" />

        {/* 헤더 */}
        <header className="home-header">
          <div className="home-logo">PawLink</div>
          <div className="home-location">📍</div>
        </header>

        {/* 상단 배너 */}
        <section className="home-hero" />

        {/* 말풍선 배너 */}
        <section className="home-chip-wrap">
          <div className="home-chip">
            <span className="home-chip-icon">🐾</span>
            <span className="home-chip-text">산책시 리드줄은 필수예요!</span>
          </div>
        </section>

        {/* 주간 랭킹 */}
        <section className="home-ranking">
          <div className="home-ranking-header">우리동네 주간 산책랭크</div>
          <ul className="home-ranking-list">
            {RANKING_DATA.map((item) => (
              <li key={item.id} className="home-ranking-item">
                <div className="home-ranking-left">
                  <span className="home-ranking-number">{item.id}</span>
                  <div className="home-ranking-texts">
                    <p className="home-ranking-name">{item.name}</p>
                    <p className="home-ranking-meta">
                      {item.distance} | {item.dogs}
                    </p>
                  </div>
                </div>
                <div className="home-ranking-avatar">
                  <UserIcon />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 하단 네비게이션 (스크롤해도 아래 붙어 있게 sticky) */}
        <nav className="home-bottom-nav">
          <button className="home-bottom-nav-item is-active" type="button">
            <span className="home-bottom-nav-icon">🏠</span>
            <span className="home-bottom-nav-label">홈</span>
          </button>
          <button className="home-bottom-nav-item" type="button">
            <span className="home-bottom-nav-icon">📋</span>
            <span className="home-bottom-nav-label">게시판</span>
          </button>
          <button className="home-bottom-nav-item" type="button">
            <span className="home-bottom-nav-icon">💬</span>
            <span className="home-bottom-nav-label">채팅</span>
          </button>
          <button className="home-bottom-nav-item" type="button">
            <span className="home-bottom-nav-icon">👤</span>
            <span className="home-bottom-nav-label">마이페이지</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Home;
