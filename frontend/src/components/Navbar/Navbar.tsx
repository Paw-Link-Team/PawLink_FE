// frontend/src/components/NavBar.tsx
import { NavLink } from "react-router-dom";
import "./NavBar.css";

type IconProps = { active: boolean };

function HomeIcon({ active }: IconProps) {
  return active ? (
    // filled home
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l9 8h-2v9a1 1 0 0 1-1 1h-4v-6H10v6H6a1 1 0 0 1-1-1v-9H3l9-8z" />
    </svg>
  ) : (
    // outline home
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path
        d="M3 11l9-8 9 8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 10.8V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9.2"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BoardIcon({ active }: IconProps) {
  return active ? (
    // filled board (document with folded corner + sparkle 느낌)
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3h7l3 3v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v4h4" />
      <path d="M18.2 7.8l.7.7-.7.7-.7-.7.7-.7z" />
    </svg>
  ) : (
    // outline board
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path
        d="M7 3h7l3 3v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M14 3v4h4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M18 8.2l.6.6-.6.6-.6-.6.6-.6z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatIcon({ active }: IconProps) {
  return active ? (
    // filled chat bubble
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6.5A3.5 3.5 0 0 1 7.5 3h9A3.5 3.5 0 0 1 20 6.5v6A3.5 3.5 0 0 1 16.5 16H10l-4.6 3.2A.8.8 0 0 1 4 18.5V6.5z" />
      <circle cx="9" cy="10" r="1.2" />
      <circle cx="12" cy="10" r="1.2" />
      <circle cx="15" cy="10" r="1.2" />
    </svg>
  ) : (
    // outline chat
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path
        d="M7.5 3h9A3.5 3.5 0 0 1 20 6.5v6A3.5 3.5 0 0 1 16.5 16H10l-4.6 3.2A.8.8 0 0 1 4 18.5V6.5A3.5 3.5 0 0 1 7.5 3z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="10" r="1.1" fill="currentColor" />
      <circle cx="12" cy="10" r="1.1" fill="currentColor" />
      <circle cx="15" cy="10" r="1.1" fill="currentColor" />
    </svg>
  );
}

function UserIcon({ active }: IconProps) {
  return active ? (
    // filled user
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12.2a4.4 4.4 0 1 0-4.4-4.4 4.4 4.4 0 0 0 4.4 4.4z" />
      <path d="M4.8 21a7.2 7.2 0 0 1 14.4 0H4.8z" />
    </svg>
  ) : (
    // outline user
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path
        d="M12 12.2a4.4 4.4 0 1 0-4.4-4.4 4.4 4.4 0 0 0 4.4 4.4z"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path
        d="M4.8 21a7.2 7.2 0 0 1 14.4 0"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function NavBar() {
  return (
    <>
      <nav className="pl-nav" aria-label="PawLink bottom navigation">
        <NavLink to="/home" className={({ isActive }) => `pl-nav-item ${isActive ? "active" : ""}`}>
          {({ isActive }) => (
            <>
              <span className="pl-nav-ico">{<HomeIcon active={isActive} />}</span>
              <span className="pl-nav-txt">홈</span>
            </>
          )}
        </NavLink>

        <NavLink to="/board" className={({ isActive }) => `pl-nav-item ${isActive ? "active" : ""}`}>
          {({ isActive }) => (
            <>
              <span className="pl-nav-ico">{<BoardIcon active={isActive} />}</span>
              <span className="pl-nav-txt">게시판</span>
            </>
          )}
        </NavLink>

        <NavLink to="/chat" className={({ isActive }) => `pl-nav-item ${isActive ? "active" : ""}`}>
          {({ isActive }) => (
            <>
              <span className="pl-nav-ico">{<ChatIcon active={isActive} />}</span>
              <span className="pl-nav-txt">채팅</span>
            </>
          )}
        </NavLink>

        <NavLink to="/mypage" className={({ isActive }) => `pl-nav-item ${isActive ? "active" : ""}`}>
          {({ isActive }) => (
            <>
              <span className="pl-nav-ico">{<UserIcon active={isActive} />}</span>
              <span className="pl-nav-txt">마이페이지</span>
            </>
          )}
        </NavLink>
      </nav>

      <div className="pl-home-indicator" aria-hidden="true" />
    </>
  );
}
