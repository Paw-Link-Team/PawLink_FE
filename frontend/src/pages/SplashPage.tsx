import "./SplashPage.css";
import pawlinkLogo from "../assets/pawlink-logo.png";

export default function SplashPage() {
  return (
    <div className="splash-root">
      <img className="splash-logo" src={pawlinkLogo} alt="PawLink" />
    </div>
  );
}
