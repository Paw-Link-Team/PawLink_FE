// frontend/src/pages/ChatRoom.tsx
import { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import PhoneFrame from "../components/PhoneFrame";
import api from "../api/api";
import { fetchChatRoomDetail, createChatRoomByBoardId } from "../api/chat";
import type { AppointmentPayload, ChatMessageDto, ChatRoomDetail } from "../api/chat";
import { getMyInfo } from "../api/mypage";
import "./ChatRoom.css";

type MessageSide = "left" | "right";

const formatMessageTime = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    minute: "numeric",
  }).format(date);
};

const formatDateHeader = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const formatAppointmentSummary = (appointment: AppointmentPayload | null | undefined) => {
  if (!appointment) return "";
  const parts: string[] = [];
  if (appointment.date) {
    const dateObj = new Date(appointment.date);
    if (!Number.isNaN(dateObj.getTime())) {
      parts.push(`${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`);
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

const deriveSocketOrigin = () => {
  const envUrl = (import.meta.env.VITE_SOCKET_URL as string | undefined) ?? "";
  if (envUrl) return envUrl;
  const base = api.defaults.baseURL;
  if (!base) return "";
  try {
    const parsed = new URL(base);
    return parsed.origin;
  } catch {
    return base.replace(/\/api$/, "");
  }
};

const SOCKET_ORIGIN = deriveSocketOrigin();

export default function ChatRoomPage() {
  const navigate = useNavigate();
  const { roomId, boardId } = useParams();
  const [numericRoomId, setNumericRoomId] = useState<number>(roomId ? Number(roomId) : NaN);

  const [input, setInput] = useState("");
  const [isPlusOpen, setIsPlusOpen] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [kbOffset, setKbOffset] = useState(0);
  const [detail, setDetail] = useState<ChatRoomDetail | null>(null);
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [me, setMe] = useState<{ userId: number; nickname: string; phoneNumber?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement | null>(null);
  const albumInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const appointmentSummary = useMemo(() => formatAppointmentSummary(detail?.appointment), [detail]);
  const headerName = detail?.profileName ?? "채팅 상대";
  const postTitle = detail?.post?.title ?? "산책 게시글";
  const postSub = appointmentSummary || detail?.post?.information || "약속 정보를 확인해보세요";
  const phoneNumber = detail?.profilePhone ?? me?.phoneNumber ?? "";
  const canCall = phoneNumber.trim().length > 0;

  const isMine = useCallback(
    (message: ChatMessageDto) => {
      if (!me) return false;
      if (typeof message.senderUserId === "number") {
        return message.senderUserId === me.userId;
      }
      if (message.senderNickname && me.nickname) {
        return message.senderNickname === me.nickname;
      }
      return false;
    },
    [me]
  );

  const getSide = useCallback((message: ChatMessageDto): MessageSide => (isMine(message) ? "right" : "left"), [isMine]);

  const shouldShowAvatar = useCallback(
    (index: number, side: MessageSide) => {
      if (side !== "left") return false;
      const prev = messages[index - 1];
      if (!prev) return true;
      return getSide(prev) === "right";
    },
    [getSide, messages]
  );

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const onResize = () => {
      const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKbOffset(offset);
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
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    });
  }, [numericRoomId, isPlusOpen, isKeyboardOpen, isCallOpen, messages]);

  useEffect(() => {
    if (!isCallOpen) return;
    setIsPlusOpen(false);
    setIsKeyboardOpen(false);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isCallOpen]);

  useEffect(() => {
    let ignore = false;

    const init = async () => {
      try {
        setLoading(true);
        setError(null);

        let currentRoomId = numericRoomId;

        // boardId가 있고 roomId가 없는 경우 채팅방 생성/조회
        if (!Number.isFinite(currentRoomId) && boardId) {
          const createRes = await createChatRoomByBoardId(Number(boardId));
          if (createRes.data.success) {
            currentRoomId = createRes.data.data;
            setNumericRoomId(currentRoomId);
            // URL 업데이트 (선택사항)
            // navigate(`/chat/${currentRoomId}`, { replace: true });
          } else {
            throw new Error(createRes.data.message || "채팅방 생성 실패");
          }
        }

        if (!Number.isFinite(currentRoomId)) {
          setLoading(false);
          setError("유효하지 않은 채팅방입니다.");
          return;
        }

        const [roomRes, meRes] = await Promise.all([fetchChatRoomDetail(currentRoomId), getMyInfo()]);
        if (ignore) return;

        const detailData = roomRes.data.data ?? null;
        setDetail(detailData);
        setMessages(detailData?.messages ?? []);

        const myData = meRes.data.data;
        if (myData) {
          setMe({ userId: myData.userId, nickname: myData.nickname, phoneNumber: myData.phoneNumber });
        }
      } catch (err) {
        if (ignore) return;
        console.error("채팅방 정보를 불러오지 못했습니다.", err);
        setError("채팅방 정보를 불러오지 못했습니다.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    init();
    return () => {
      ignore = true;
    };
  }, [roomId, boardId]); // numericRoomId는 내부 state이므로 의존성에서 제외하고 로직 내에서 처리

  useEffect(() => {
    if (!Number.isFinite(numericRoomId) || !SOCKET_ORIGIN) {
      return;
    }

    const socket = io(SOCKET_ORIGIN, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;
    socket.emit("joinRoom", numericRoomId);
    socket.on("newMessage", (incoming: ChatMessageDto) => {
      setMessages((prev) => [...prev, incoming]);
    });

    return () => {
      socket.emit("leaveRoom", numericRoomId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [numericRoomId]);

  const togglePlus = () => {
    setIsPlusOpen((v) => !v);
    setIsKeyboardOpen(false);
  };

  const onFocusInput = () => {
    setIsKeyboardOpen(true);
    setIsPlusOpen(false);
  };

  const onBlurInput = () => {
    setIsKeyboardOpen(false);
  };

  const openAlbum = () => albumInputRef.current?.click();
  const openCamera = () => cameraInputRef.current?.click();

  const onPickFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    e.target.value = "";
  };

  const openCallModal = () => {
    if (!canCall) return;
    setIsCallOpen(true);
  };
  const closeCallModal = () => setIsCallOpen(false);

  const onCallConfirm = () => {
    if (!canCall) {
      setIsCallOpen(false);
      return;
    }
    window.location.href = `tel:${phoneNumber.replace(/[^0-9+]/g, "")}`;
    setIsCallOpen(false);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || !socketRef.current || !Number.isFinite(numericRoomId) || !me) return;

    const payload: ChatMessageDto = {
      chatRoomId: numericRoomId,
      senderUserId: me.userId,
      senderNickname: me.nickname,
      message: text,
    };

    socketRef.current.emit("sendMessage", payload);
    setInput("");
  };

  const handleWalkClick = async () => {
    try {
      // 1️⃣ 현재 산책 중인지 서버에 확인
      const res = await api.get("/api/walk/session");
      const walking = res.data.data?.walking === true;

      if (!walking) {
        // ▶ 산책 시작
        await api.post("/api/walk/start", {
          chatRoomId: numericRoomId,
        });

        socketRef.current?.emit("sendMessage", {
          chatRoomId: numericRoomId,
          message: "🐾 산책을 시작했어요!",
        });
      } else {
        // ⏹ 산책 종료
        const endRes = await api.post("/api/walk/end", {
          distanceKm: 2.3, // TODO: 실제 거리
        });

        socketRef.current?.emit("sendMessage", {
          chatRoomId: numericRoomId,
          message: "🎉 산책이 종료되었어요! 리뷰를 남겨주세요 🐾",
        });

        navigate("/walk/result", {
          state: {
            chatRoomId: numericRoomId,
            history: endRes.data.data,
          },
        });
      }

      setIsPlusOpen(false);
    } catch (e) {
      alert("산책 처리 중 오류가 발생했어요.");
    }
  };


  const openAppointmentPage = () => {
    if (!numericRoomId) return;
    navigate(`/chat/${numericRoomId}/appointment`, { state: { partnerName: headerName } });
  };

  const canSend = input.trim().length > 0 && Number.isFinite(numericRoomId) && !!me;
  const currentDateLabel = useMemo(() => formatDateHeader(messages[0]?.sentAt), [messages]);

  const renderMessages = () => {
    if (loading) return <div className="cr-chat-empty">메시지를 불러오는 중입니다...</div>;
    if (error) return <div className="cr-chat-empty error">{error}</div>;
    if (messages.length === 0) return <div className="cr-chat-empty">아직 메시지가 없어요. 첫 메시지를 보내보세요!</div>;

    return (
      <>
        {currentDateLabel && <div className="cr-date">{currentDateLabel}</div>}
        {messages.map((message, index) => {
          const side = getSide(message);
          const key = message.sentAt ? `${message.chatRoomId}-${message.sentAt}-${index}` : `${message.chatRoomId}-${index}`;
          return (
            <div key={key} className={`cr-row ${side}`}>
              {side === "left" && <div className={`cr-mini-ava ${shouldShowAvatar(index, side) ? "" : "ghost"}`} aria-hidden="true" />}

              <div className={`cr-msgline ${side}`}>
                <div className={`cr-bubble ${side}`}>{message.message}</div>
                <div className="cr-time">{formatMessageTime(message.sentAt)}</div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <PhoneFrame className="cr-screen">
      <div className="cr-status" />

      <header className="cr-topbar">
        <button className="cr-ico-btn" aria-label="back" onClick={() => navigate(-1)} type="button">
          <span className="cr-back">‹</span>
        </button>

        <div className="cr-title-center">
          <div className="cr-name">{headerName}</div>
        </div>

        <button className="cr-ico-btn" aria-label="call" onClick={openCallModal} type="button" disabled={!canCall}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 16.92v3a2 2 0 0 1-2.18 2
                 19.8 19.8 0 0 1-8.63-3.07
                 19.5 19.5 0 0 1-6-6
                 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.09 2h3
                 a2 2 0 0 1 2 1.72
                 12.8 12.8 0 0 0 .7 2.81
                 2 2 0 0 1-.45 2.11L8.09 9.91
                 a16 16 0 0 0 6 6l1.27-1.27
                 a2 2 0 0 1 2.11-.45
                 12.8 12.8 0 0 0 2.81.7
                 A2 2 0 0 1 22 16.92z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </header>

      <section className="cr-post">
        <div className="cr-post-thumb" aria-hidden="true" />
        <div className="cr-post-texts">
          <div className="cr-post-title">{postTitle}</div>
          <div className="cr-post-sub">{postSub}</div>
        </div>
      </section>

      <div className="cr-chat" ref={listRef}>
        {renderMessages()}
      </div>

      <input ref={albumInputRef} className="cr-hidden-file" type="file" accept="image/*" multiple onChange={onPickFiles} />
      <input ref={cameraInputRef} className="cr-hidden-file" type="file" accept="image/*" capture="environment" onChange={onPickFiles} />

      <div className={`cr-bottom ${isPlusOpen ? "plus-open" : ""} ${isKeyboardOpen ? "keyboard-open" : ""}`} style={{ transform: `translate(-50%, -${kbOffset}px)` }}>
        <div className="cr-inputbar">
          <button className="cr-plus" onClick={togglePlus} aria-label="plus" type="button">
            +
          </button>

          <div className="cr-inputbox">
            <span className="cr-paw" aria-hidden="true">
              🐾
            </span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={onFocusInput}
              onBlur={onBlurInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="산책시 리드줄은 필수예요!"
            />
          </div>

          <button className="cr-send" aria-label="send" type="button" onClick={handleSend} disabled={!canSend}>
            ▷
          </button>
        </div>

        {isPlusOpen && (
          <div className="cr-plus-panel">
            <button className="cr-plus-item" type="button" aria-label="album" onClick={openAlbum}>
              <div className="cr-plus-icon" aria-hidden="true">
                🖼
              </div>
              <div className="cr-plus-label">앨범</div>
            </button>

            <button className="cr-plus-item" type="button" aria-label="camera" onClick={openCamera}>
              <div className="cr-plus-icon" aria-hidden="true">
                📷
              </div>
              <div className="cr-plus-label">카메라</div>
            </button>

            <button className="cr-plus-item" type="button" aria-label="appointment" onClick={openAppointmentPage} disabled={!numericRoomId}>
              <div className="cr-plus-icon" aria-hidden="true">
                ⏰
              </div>
              <div className="cr-plus-label">약속</div>
            </button>
            <button
              className="cr-plus-item cr-walk"
              onClick={handleWalkClick}
              disabled={!roomId}
            >
              <div className="cr-plus-icon">🐾</div>
              <div className="cr-plus-label">산책</div>
            </button>
          </div>
        )}

        <div className="cr-keyboard-pad" />
      </div>

      {isCallOpen && (
        <div className="cr-modal-dim" role="dialog" aria-modal="true" aria-label="전화 걸기" onClick={closeCallModal}>
          <div className="cr-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="cr-modal-ico" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2
                     19.8 19.8 0 0 1-8.63-3.07
                     19.5 19.5 0 0 1-6-6
                     19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.09 2h3
                     a2 2 0 0 1 2 1.72
                     12.8 12.8 0 0 0 .7 2.81
                     2 2 0 0 1-.45 2.11L8.09 9.91
                     a16 16 0 0 0 6 6l1.27-1.27
                     a2 2 0 0 1 2.11-.45
                     12.8 12.8 0 0 0 2.81.7
                     A2 2 0 0 1 22 16.92z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="cr-modal-text">{headerName} 님에게 전화를 걸까요?</div>

            <div className="cr-modal-actions">
              <button className="cr-modal-btn ghost" type="button" onClick={closeCallModal}>
                취소
              </button>
              <button className="cr-modal-btn primary" type="button" onClick={onCallConfirm} disabled={!canCall}>
                전화하기
              </button>
            </div>
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}
