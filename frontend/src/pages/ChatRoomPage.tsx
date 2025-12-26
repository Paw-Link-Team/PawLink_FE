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
  appointment: AppointmentPayload | null | undefined
) => {
  if (!appointment) return "";
  const parts: string[] = [];
  if (appointment.date) {
    const d = new Date(appointment.date);
    if (!Number.isNaN(d.getTime())) {
      parts.push(`${d.getMonth() + 1}월 ${d.getDate()}일`);
    }
  }
  if (appointment.time) parts.push(appointment.time.slice(0, 5));
  if (appointment.locationAddress) parts.push(appointment.locationAddress);
  return parts.join(" | ");
};

const deriveSocketOrigin = () => {
  const env = import.meta.env.VITE_SOCKET_URL as string | undefined;
  console.log("Socket Origin:", env);
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

  const initRef = useRef(false);
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
    phoneNumber?: string;
  } | null>(null);

  const [input, setInput] = useState("");
  const [isPlusOpen, setIsPlusOpen] = useState(false);
  const [kbOffset, setKbOffset] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    appointmentSummary || detail?.post?.information || "약속 정보를 확인해보세요";

  /* ======================
   * message helpers
   * ====================== */
  const isMine = useCallback(
    (m: ChatMessageDto) =>
      !!me &&
      (m.senderUserId === me.userId ||
        m.senderNickname === me.nickname),
    [me]
  );

  const getSide = useCallback(
    (m: ChatMessageDto): MessageSide => (isMine(m) ? "right" : "left"),
    [isMine]
  );

  /* ======================
   * viewport
   * ====================== */
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const onResize = () => {
      const offset = window.innerHeight - vv.height - vv.offsetTop;
      setKbOffset(Math.max(0, offset));
    };

    vv.addEventListener("resize", onResize);
    vv.addEventListener("scroll", onResize);
    onResize();

    return () => {
      vv.removeEventListener("resize", onResize);
      vv.removeEventListener("scroll", onResize);
    };
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
      });
    });
  }, [messages, isPlusOpen]);

  /* ======================
   * init
   * ====================== */
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    let cancelled = false;

    const init = async () => {
      try {
        setLoading(true);
        setError(null);

        let room = numericRoomId;

        // roomId가 없고 boardId만 있으면 채팅방 생성
        if (!Number.isFinite(room) && boardId) {
          const res = await createChatRoomByBoardId(Number(boardId));
          room = res.data.data;
          setNumericRoomId(room);
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
        setMessages(roomRes.data.data?.messages ?? []);
        setMe(meRes.data.data);
      } catch (e) {
        if (!cancelled) {
          console.error(e);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    socket.on("newMessage", (msg: ChatMessageDto) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit("leaveRoom", numericRoomId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [numericRoomId]);

  /* ======================
   * handlers
   * ====================== */
  const send = () => {
    if (!input.trim() || !socketRef.current || !Number.isFinite(numericRoomId)) {
      return;
    }

    // sender 정보는 서버가 인증 기반으로 채우는 것을 권장
    socketRef.current.emit("sendMessage", {
      chatRoomId: numericRoomId,
      message: input.trim(),
    });

    setInput("");
  };

  const togglePlus = () => setIsPlusOpen((v) => !v);

  const openAlbum = () => albumInputRef.current?.click();
  const openCamera = () => cameraInputRef.current?.click();

  const openAppointmentPage = () => {
    navigate(`/chat/${numericRoomId}/appointment`);
  };

  const handleWalkClick = async () => {
  try {
    await api.post("/api/walks/start"); // 👈 토큰만

    socketRef.current?.emit("sendMessage", {
      chatRoomId: numericRoomId,
      message: "🐾 산책을 시작했어요!",
    });

    setIsPlusOpen(false);
  } catch {
    alert("산책 처리 중 오류가 발생했어요.");
  }
};


  /* ======================
   * render helpers
   * ====================== */
  const currentDateLabel = useMemo(
    () => formatDateHeader(messages[0]?.sentAt),
    [messages]
  );

  return (
    <PhoneFrame>
      <div className="crp-screen">
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

        <section className="crp-post" onClick={openAppointmentPage}>
          <div className="crp-post-thumb">🗻</div>
          <div>
            <div className="crp-post-title">{postTitle}</div>
            <div className="crp-post-sub">{postSub}</div>
          </div>
        </section>

        {loading && <div className="crp-empty">로딩 중...</div>}
        {!loading && error && <div className="crp-empty">{error}</div>}

        {!loading && !error && (
          <div className="crp-chat" ref={listRef}>
            {messages.length === 0 && (
              <div className="crp-empty">아직 메시지가 없어요.</div>
            )}

            {/* (옵션) 날짜 헤더를 간단히 표시: 첫 메시지 기준 */}
            {messages.length > 0 && (
              <div className="crp-date-header">{currentDateLabel}</div>
            )}

            {messages.map((m, idx) => {
              const side = getSide(m);

              return (
                <div key={idx} className={`crp-msg crp-msg-${side}`}>
                  <div className="crp-msg-bubble">{m.message}</div>
                  <div className="crp-msg-time">
                    {formatMessageTime(m.sentAt)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

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
                placeholder="산책시 리드줄은 필수예요!"
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
              />
            </div>

            <button className="crp-send" onClick={send} type="button">
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

              {/* (옵션) 산책 시작 */}
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

          {/* 파일 입력(현재는 핸들러만 연결) */}
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
