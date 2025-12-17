import { NavLink } from "react-router-dom";
import "./NavBar.css";

type NavKey = "home" | "board" | "chat" | "mypage";

export default function NavBar({ active }: { active: NavKey }) {
  return (
    <>
      <nav className="pl-nav">
        <NavItem to="/home" label="홈" icon="⌂" isActive={active === "home"} />
        <NavItem to="/board" label="게시판" icon="▣" isActive={active === "board"} />
        <NavItem to="/chat" label="채팅" icon="💬" isActive={active === "chat"} />
        <NavItem to="/mypage" label="마이페이지" icon="👤" isActive={active === "mypage"} />
      </nav>

      {/* 하단 홈 인디케이터(검은 바)도 공통으로 포함 */}
      <div className="pl-home-indicator" />
    </>
  );
}

function NavItem({
  to,
  label,
  icon,
  isActive,
}: {
  to: string;
  label: string;
  icon: string;
  isActive: boolean;
}) {
  return (
    <NavLink to={to} className={`pl-nav-item ${isActive ? "active" : ""}`}>
      <div className="pl-nav-ico">{icon}</div>
      <div className="pl-nav-txt">{label}</div>
    </NavLink>
  );
}
