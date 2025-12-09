import React from "react";
import "./Navbar.css";

interface NavItem {
  label: string;
  icon: string;
  path: string;
}
const navItem: NavItem[] = [
  { label: "홈", icon: "🏠", path: "/" },
  { label: "게시판", icon: "📋", path: "/board" },
  { label: "채팅", icon: "💬", path: "/chat" },
  { label: "마이페이지", icon: "👤", path: "/mypage" },
];

const Navbar =  () => {
    return (
        <nav className="bottom-nav">
            {navItem.map((item) => (
                <button key={item.label} className="bottom-nav-item" type="button">
                    <span className="bottom-nav-icon">{item.icon}</span>
                    <span className="bottom-nav-label">{item.label}</span>
                </button>
            ))} 
        </nav>
    );
}

export default Navbar;