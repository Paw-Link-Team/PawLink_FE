import React from "react";
import "./Header.css";

interface HomeHeaderProps {
  location?: string;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ location }) => {
  return (
    <header className="home-header">
      <div className="home-logo">PawLink</div>
      <div className="home-location">
        📍 {location ?? ""}
      </div>
    </header>
  );
};

export default HomeHeader;
