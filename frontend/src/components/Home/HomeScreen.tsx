import Header from "./Header";
import HeroBanner from "./HeroBanner";
import ChipBanner from "./ChipBanner";
import RankingSection from "./Ranking/RankingSection";
import "./home.css";

import banner1 from "../../images/dogs.png"
import banner2 from "../../images/dog2.png"
import logo from "../../images/pawlink_logo.png"

export default function HomeScreen() {
  return (
    <div className="home-screen-wrapper">
      <div className="home-screen">
        <div className="home-status-bar" />

        <Header />

        <HeroBanner images={[banner1, logo, banner2]}/>

        <ChipBanner text="산책시 리드줄은 필수예요!" />

        <RankingSection />
      </div>
    </div>
  );
}
