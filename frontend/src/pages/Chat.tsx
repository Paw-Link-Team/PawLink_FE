// frontend/src/pages/Chat.tsx (또는 ChatPage.tsx)
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { fetchChatRooms } from "../api/chat";
import type { ChatRoomStatus, ChatRoomSummary } from "../api/chat";
import "./Chat.css";

type TabKey = "all" | "unread" | "done";

const TAB_TO_FILTER: Record<TabKey, ChatRoomStatus> = {
  all: "ALL",
  unread: "UNREAD",
  done: "COMPLETED",
};

const formatListTime = (value?: string | null) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(parsed);
};

const Avatar = ({ profileUrl, title }: { profileUrl?: string | null; title?: string | null }) => {
  if (profileUrl) {
    return <img src={profileUrl} alt={title ?? "채팅 상대"} />;
  }

  return (
    <svg className="chat-avatar-paw" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="7.3" cy="8.4" r="2" />
      <circle cx="12" cy="6.9" r="2.1" />
      <circle cx="16.7" cy="8.4" r="2" />
      <circle cx="19.1" cy="11.6" r="1.85" />
      <path d="M6.2 16.4c0-3 2.9-5.3 5.8-5.3s5.8 2.3 5.8 5.3c0 2.5-2.2 4.6-5.8 4.6s-5.8-2.1-5.8-4.6z" />
    </svg>
  );
};

export default function ChatPage() {
  const nav = useNavigate();
  const [tab, setTab] = useState<TabKey>("all");
  const [rooms, setRooms] = useState<ChatRoomSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchChatRooms(TAB_TO_FILTER[tab]);
        if (ignore) return;
        setRooms(response.data.data ?? []);
      } catch (err) {
        if (ignore) return;
        console.error("채팅방 조회 실패", err);
        setRooms([]);
        setError("채팅 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchRooms();
    return () => {
      ignore = true;
    };
  }, [tab]);

  const listClass = useMemo(() => (tab === "unread" ? "chat-list unread-bg" : "chat-list"), [tab]);

  const goRoom = (roomId: number) => {
    nav(`/chat/${roomId}`);
  };

  const renderBody = () => {
    if (loading) {
      return <div className="chat-empty">채팅방을 불러오는 중입니다...</div>;
    }

    if (error) {
      return <div className="chat-empty error">{error}</div>;
    }

    if (rooms.length === 0) {
      return <div className="chat-empty">표시할 채팅방이 없어요.</div>;
    }

    return (
      <ul className={listClass}>
        {rooms.map((chat) => (
          <li
            key={chat.chatRoomId}
            className="chat-item"
            role="button"
            tabIndex={0}
            onClick={() => goRoom(chat.chatRoomId)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") goRoom(chat.chatRoomId);
            }}
          >
            <div className="chat-avatar">
              <Avatar profileUrl={chat.profileImgUrl} title={chat.title} />
            </div>

            <div className="chat-content">
              <div className="chat-name">{chat.title ?? "산책 파트너"}</div>
              <div className="chat-message">{chat.lastMessage ?? "아직 메시지가 없습니다."}</div>
            </div>

            <div className="chat-meta">
              <span className="chat-time">{formatListTime(chat.lastSentAt)}</span>
              {chat.unreadCount > 0 && <span className="chat-badge">{chat.unreadCount}</span>}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-screen">
        <div className="chat-status-bar" />

        <header className="chat-header">
          <span className="chat-header-title">채팅</span>
        </header>

        <div className="chat-tabs">
          <button type="button" className={`chat-tab ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>
            전체
          </button>
          <button type="button" className={`chat-tab ${tab === "unread" ? "active" : ""}`} onClick={() => setTab("unread")}>
            안 읽은 채팅방
          </button>
          <button type="button" className={`chat-tab ${tab === "done" ? "active" : ""}`} onClick={() => setTab("done")}>
            완료된 산책
          </button>
        </div>

        {renderBody()}

        <NavBar active="chat" />
      </div>
    </div>
  );
}
