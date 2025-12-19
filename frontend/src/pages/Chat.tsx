import { useState } from "react";
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
  const [tab, setTab] = useState<TabKey>("all");

  const filteredData = CHAT_DATA.filter((chat) => {
    if (tab === "unread") return chat.unread;
    if (tab === "done") return false;
    return true;
  });

  return (
    <div className="chat-wrapper">
      <div className="chat-screen">
        {/* 상태바 여백 */}
        <div className="chat-status-bar" />

        {/* 헤더 */}
        <header className="chat-header">채팅</header>

        {/* 탭 */}
        <div className="chat-tabs">
          <button
            className={`chat-tab ${tab === "all" ? "active" : ""}`}
            onClick={() => setTab("all")}
          >
            전체
          </button>
          <button
            className={`chat-tab ${tab === "unread" ? "active" : ""}`}
            onClick={() => setTab("unread")}
          >
            안 읽은 채팅방
          </button>
          <button
            className={`chat-tab ${tab === "done" ? "active" : ""}`}
            onClick={() => setTab("done")}
          >
            완료된 산책
          </button>
        </div>

        {/* 채팅 리스트 */}
        <ul className={`chat-list ${tab === "unread" ? "unread-bg" : ""}`}>
          {filteredData.map((chat) => (
            <li key={chat.id} className="chat-item">
              <div className="chat-avatar">👤</div>

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

        {/* 하단 네비 */}
        <NavBar active="chat" />
      </div>
    </div>
  );
}
