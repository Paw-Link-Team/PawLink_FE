import Header from "./Header";
import HeroBanner from "./HeroBanner";
import ChipBanner from "./ChipBanner";
import RankingSection from "./Ranking/RankingSection";
import "./home.css";

export default function HomeScreen() {
  return (
    <div className="home-screen-wrapper">
      <div className="home-screen">
        <div className="home-status-bar" />

        <Header />

        <HeroBanner />

        <ChipBanner text="산책시 리드줄은 필수예요!" />

        <RankingSection />
      </div>
    </div>
  );
}
