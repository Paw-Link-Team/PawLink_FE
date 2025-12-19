// frontend/src/pages/Chat.tsx (또는 ChatPage.tsx)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "./Chat.css";

type TabKey = "all" | "unread" | "done";

const CHAT_DATA = [
  {
    id: 1,
    name: "강정욱",
    message: "내일 오후 3시 황송목록원 어떠신가요?",
    time: "오전 9:38",
    unread: true,
  },
  {
    id: 2,
    name: "상대방 이름",
    message: "대화내용이 표시됩니다 일정이랑 길어지면...",
    time: "오전 9:38",
    unread: true,
  },
  {
    id: 3,
    name: "상대방 이름",
    message: "대화내용이 표시됩니다 일정이랑 길어지면...",
    time: "오전 9:38",
    unread: false,
  },
  {
    id: 4,
    name: "상대방 이름",
    message: "대화내용이 표시됩니다 일정이랑 길어지면...",
    time: "오전 9:38",
    unread: false,
  },
];

export default function ChatPage() {
  const nav = useNavigate();
  const [tab, setTab] = useState<TabKey>("all");

  const filteredData = CHAT_DATA.filter((chat) => {
    if (tab === "unread") return chat.unread;
    if (tab === "done") return false;
    return true;
  });

  const goRoom = (roomId: number) => {
    nav(`/chat/${roomId}`);
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-screen">
        <div className="chat-status-bar" />

        {/* ✅ 상단 왼쪽 타이틀(2번째 사진처럼) */}
        <header className="chat-header">
          <span className="chat-header-title">채팅</span>
        </header>

        {/* 탭 */}
        <div className="chat-tabs">
          <button
            type="button"
            className={`chat-tab ${tab === "all" ? "active" : ""}`}
            onClick={() => setTab("all")}
          >
            전체
          </button>
          <button
            type="button"
            className={`chat-tab ${tab === "unread" ? "active" : ""}`}
            onClick={() => setTab("unread")}
          >
            안 읽은 채팅방
          </button>
          <button
            type="button"
            className={`chat-tab ${tab === "done" ? "active" : ""}`}
            onClick={() => setTab("done")}
          >
            완료된 산책
          </button>
        </div>

        {/* 채팅 리스트 */}
        <ul className={`chat-list ${tab === "unread" ? "unread-bg" : ""}`}>
          {filteredData.map((chat) => (
            <li
              key={chat.id}
              className="chat-item"
              role="button"
              tabIndex={0}
              onClick={() => goRoom(chat.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") goRoom(chat.id);
              }}
            >
              {/* ✅ 아바타: 2번째 사진 느낌(아이콘/원형) */}
              <div className="chat-avatar" aria-hidden="true">
                🐾
              </div>

              <div className="chat-content">
                <div className="chat-name">{chat.name}</div>
                <div className="chat-message">{chat.message}</div>
              </div>

              <div className="chat-meta">
                <span className="chat-time">{chat.time}</span>
                {chat.unread && <span className="chat-badge">1</span>}
              </div>
            </li>
          ))}
        </ul>

        <NavBar active="chat" />
      </div>
    </div>
  );
}
