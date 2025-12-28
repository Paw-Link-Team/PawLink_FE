import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import PhoneFrame from "../components/PhoneFrame";
import api from "../api/api";
import {
  fetchChatRoomDetail,
  createChatRoomByBoardId,
} from "../api/chat";
import type {
  AppointmentPayload,
  ChatMessageDto,
  ChatRoomDetail,
} from "../api/chat";
import { getMyInfo } from "../api/mypage";
import "./ChatRoomPage.css";

type MessageSide = "left" | "right";

/* ======================
 * utils
 * ====================== */
const formatMessageTime = (value?: string | null) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    minute: "numeric",
  }).format(d);
};

const formatDateHeader = (value?: string | null) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
};

const formatAppointmentSummary = (
  appointment?: AppointmentPayload | null
) => {
  if (!appointment) return "";
  const parts: string[] = [];

  if (appointment.date) {
    const d = new Date(appointment.date);
    if (!Number.isNaN(d.getTime())) {
      parts.push(`${d.getMonth() + 1}월 ${d.getDate()}일`);
    }
  }

  if (appointment.time) {
    parts.push(appointment.time.slice(0, 5));
  }

  if (appointment.locationAddress) {
    parts.push(appointment.locationAddress);
  }

  return parts.join(" | ");
};

/* ======================
 * optimistic message
 * ====================== */
const buildOptimisticMessage = (
  chatRoomId: number,
  text: string,
  me: { userId: number; nickname: string }
): ChatMessageDto => ({
  chatRoomId,
  senderUserId: me.userId,
  senderNickname: me.nickname,
  message: text,
  sentAt: new Date().toISOString(),
  read: true,
});

/* ======================
 * socket origin
 * ====================== */
const deriveSocketOrigin = () => {
  const env = import.meta.env.VITE_SOCKET_URL as string | undefined;
  if (env) return env;

  const base = api.defaults.baseURL;
  if (!base) return "";

  try {
    return new URL(base).origin;
  } catch {
    return base.replace(/\/api$/, "");
  }
};

const SOCKET_ORIGIN = deriveSocketOrigin();

/* ======================
 * Component
 * ====================== */
export default function ChatRoomPage() {
  const navigate = useNavigate();
  const { roomId, boardId } = useParams();

  const socketRef = useRef<Socket | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const albumInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const [numericRoomId, setNumericRoomId] = useState<number>(
    roomId ? Number(roomId) : NaN
  );
  const [detail, setDetail] = useState<ChatRoomDetail | null>(null);
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [me, setMe] = useState<{
    userId: number;
    nickname: string;
  } | null>(null);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ======================
   * plus panel
   * ====================== */
  const [isPlusOpen, setIsPlusOpen] = useState(false);
  const kbOffset = 0;

  const togglePlus = () => setIsPlusOpen((v) => !v);
  const openAlbum = () => albumInputRef.current?.click();
  const openCamera = () => cameraInputRef.current?.click();

  /** ✅ 산책 → /walk */
  const handleWalkClick = () => {
    navigate("/walk");
  };

  /** ✅ 약속 페이지 이동 */
  const openAppointmentPage = () => {
    if (!numericRoomId) return;
    navigate(`/chat/${numericRoomId}/appointment`);
  };

  /* ======================
   * derived
   * ====================== */
  const appointmentSummary = useMemo(
    () => formatAppointmentSummary(detail?.appointment),
    [detail]
  );

  const headerName = detail?.profileName ?? "채팅 상대";
  const postTitle = detail?.post?.title ?? "산책 게시글";
  const postSub =
    appointmentSummary ||
    detail?.post?.information ||
    "약속 정보를 확인해보세요";

  /* ======================
   * message helpers
   * ====================== */
  const isMine = useCallback(
    (m: ChatMessageDto) => !!me && m.senderUserId === me.userId,
    [me]
  );

  const getSide = useCallback(
    (m: ChatMessageDto): MessageSide =>
      isMine(m) ? "right" : "left",
    [isMine]
  );

  /* ======================
   * auto scroll
   * ====================== */
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  /* ======================
   * init
   * ====================== */
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        setLoading(true);

        let room: number;

        if (roomId) {
          room = Number(roomId);
          setNumericRoomId(room);
        } else if (boardId) {
          const res = await createChatRoomByBoardId(Number(boardId));
          room = res.data.data;
          setNumericRoomId(room);
        } else {
          throw new Error("roomId 또는 boardId가 필요합니다.");
        }


        if (!Number.isFinite(room)) {
          throw new Error("Invalid roomId");
        }

        const [roomRes, meRes] = await Promise.all([
          fetchChatRoomDetail(room),
          getMyInfo(),
        ]);

        if (cancelled) return;

        setDetail(roomRes.data.data);
        setMessages(roomRes.data.data.messages ?? []);
        setMe(meRes.data.data);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setError("채팅방 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [roomId, boardId]);

  /* ======================
   * socket
   * ====================== */
  useEffect(() => {
    if (!Number.isFinite(numericRoomId) || !SOCKET_ORIGIN) return;

    const socket = io(SOCKET_ORIGIN, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;
    socket.emit("joinRoom", numericRoomId);

    socket.on("newMessage", (msg) => {
      setMessages((prev) =>
        prev.some(
          (p) =>
            p.senderUserId === msg.senderUserId &&
            p.sentAt === msg.sentAt &&
            p.message === msg.message
        )
          ? prev
          : [...prev, msg]
      );
    });


    return () => {
      socket.emit("leaveRoom", numericRoomId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [numericRoomId]);

  /* ======================
   * send
   * ====================== */
  const send = () => {
    if (
      !input.trim() ||
      !socketRef.current ||
      !me ||
      !Number.isFinite(numericRoomId)
    ) {
      return;
    }

    const text = input.trim();

    // optimistic UI
    setMessages((prev) => [
      ...prev,
      buildOptimisticMessage(numericRoomId, text, me),
    ]);

    // 🔥 서버가 기대하는 payload 형태
    socketRef.current.emit("sendMessage", {
      chatRoomId: numericRoomId,
      senderUserId: me.userId, // ✅ 필수
      message: text,
    });

    setInput("");
  };


  const currentDateLabel = useMemo(
    () => formatDateHeader(messages[0]?.sentAt),
    [messages]
  );

  /* ======================
   * render
   * ====================== */
  return (
    <PhoneFrame>
      <div className="crp-screen crp-full">
        {/* top bar */}
        <header className="crp-topbar">
          <button
            className="crp-topbar-btn"
            onClick={() => navigate(-1)}
            type="button"
          >
            ‹
          </button>
          <div className="crp-topbar-title">{headerName}</div>
          <div />
        </header>

        {/* post / appointment */}
        <section className="crp-post" onClick={openAppointmentPage}>
          <div className="crp-post-thumb">🗻</div>
          <div className="crp-post-body">
            <div className="crp-post-title">{postTitle}</div>
            <div className="crp-post-sub">{postSub}</div>

            {detail?.appointment && (
              <div className="crp-appointment-badge">
                📅 {appointmentSummary}
              </div>
            )}
          </div>
        </section>

        {loading && <div className="crp-empty">로딩 중...</div>}
        {!loading && error && <div className="crp-empty">{error}</div>}

        {!loading && !error && (
          <div className="crp-chat" ref={listRef}>
            {messages.length === 0 && (
              <div className="crp-empty">
                아직 메시지가 없어요.
              </div>
            )}

            {messages.length > 0 && (
              <div className="crp-date-header">
                {currentDateLabel}
              </div>
            )}

            {messages.map((m) => (
              <div
                key={`${m.senderUserId}-${m.sentAt}-${m.message}`}
                className={`crp-msg crp-msg-${getSide(m)}`}
              >

                <div className="crp-msg-bubble">{m.message}</div>
                <div className="crp-msg-time">
                  {formatMessageTime(m.sentAt)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* bottom */}
        <div
          className="crp-bottom"
          style={{ transform: `translateY(-${kbOffset}px)` }}
        >
          <div className="crp-inputbar">
            <button
              className="crp-plus"
              onClick={togglePlus}
              type="button"
            >
              +
            </button>

            <div className="crp-inputbox">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="메시지를 입력하세요"
                onKeyDown={(e) =>
                  e.key === "Enter" && send()
                }
              />
            </div>

            <button
              className="crp-send"
              onClick={send}
              type="button"
            >
              ▶
            </button>
          </div>

          {isPlusOpen && (
            <div className="crp-plus-panel">
              <button
                className="crp-plus-item"
                onClick={openAlbum}
                type="button"
              >
                <div className="crp-plus-icon">🖼</div>
                <div className="crp-plus-label">앨범</div>
              </button>

              <button
                className="crp-plus-item"
                onClick={openCamera}
                type="button"
              >
                <div className="crp-plus-icon">📷</div>
                <div className="crp-plus-label">카메라</div>
              </button>

              <button
                className="crp-plus-item"
                onClick={handleWalkClick}
                type="button"
              >
                <div className="crp-plus-icon">🐾</div>
                <div className="crp-plus-label">산책 시작</div>
              </button>
            </div>
          )}

          <input
            ref={albumInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: "none" }}
          />
        </div>
      </div>
    </PhoneFrame>
  );
}
