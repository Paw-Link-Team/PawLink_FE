import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PhoneFrame from "../components/PhoneFrame";
import "./ChatRoom.css";

type Msg = {
  id: number;
  side: "left" | "right";
  text: string;
  time?: string;
  showAvatar?: boolean; // ✅ 특정 메시지에서만 아바타 띄우기
};

export default function ChatRoomPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [input, setInput] = useState("");
  const [isPlusOpen, setIsPlusOpen] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  const albumInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const headerName = "강형욱";

  const messages: Msg[] = useMemo(
    () => [
      // ✅ 이 메시지에서만 상대 아바타 ON
      { id: 1, side: "left", text: "산책 해주실 분 찾습니다", time: "오전 9:37", showAvatar: true },
      { id: 2, side: "left", text: "오후 3시 | 항승 푸른수목원", time: "오전 9:38" },

      { id: 3, side: "right", text: "산책도움 지원합니다!", time: "오전 9:39" },
      { id: 4, side: "right", text: "저는 00동에 살고 산책경험이 있습니다!", time: "오전 9:40" },

      // ✅ 이 메시지에서만 상대 아바타 ON
      { id: 5, side: "left", text: "어디서 만날까요?", time: "오전 9:41", showAvatar: true },
      { id: 6, side: "left", text: "내일 오후 3시 항승목록원 어떠신가요?", time: "오전 9:41" },

      { id: 7, side: "right", text: "좋습니다!", time: "오전 9:42" },
    ],
    []
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    });
  }, [roomId, isPlusOpen, isKeyboardOpen]);

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

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    e.target.value = "";
  };

  return (
    <PhoneFrame className="cr-screen">
      <div className="cr-status" />

      <header className="cr-topbar">
        <button className="cr-ico-btn" aria-label="back" onClick={() => navigate(-1)}>
          <span className="cr-back">‹</span>
        </button>

        <div className="cr-title-center">
          <div className="cr-name">{headerName}</div>
        </div>

        <button className="cr-ico-btn" aria-label="call">
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
          <div className="cr-post-title">산책 해주실 분 찾습니다</div>
          <div className="cr-post-sub">오후 3시 | 항승 푸른수목원</div>
        </div>
      </section>

      <div className="cr-chat" ref={listRef}>
        <div className="cr-date">2025년 11월 30일</div>

        {messages.map((m) => {
          // ✅ “지정한 메시지에서만” 아바타 보이기
          const showAva = m.side === "left" && m.showAvatar === true;

          return (
            <div key={m.id} className={`cr-row ${m.side}`}>
              {m.side === "left" && (
                <div className={`cr-mini-ava ${showAva ? "" : "ghost"}`} aria-hidden="true" />
              )}

              <div className={`cr-msgline ${m.side}`}>
                <div className={`cr-bubble ${m.side}`}>{m.text}</div>
                {m.time && <div className="cr-time">{m.time}</div>}
              </div>
            </div>
          );
        })}
      </div>

      <input
        ref={albumInputRef}
        className="cr-hidden-file"
        type="file"
        accept="image/*"
        multiple
        onChange={onPickFiles}
      />
      <input
        ref={cameraInputRef}
        className="cr-hidden-file"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onPickFiles}
      />

      <div className={`cr-bottom ${isPlusOpen ? "plus-open" : ""} ${isKeyboardOpen ? "keyboard-open" : ""}`}>
        <div className="cr-inputbar">
          <button className="cr-plus" onClick={togglePlus} aria-label="plus">
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
              placeholder="산책시 리드줄은 필수예요!"
            />
          </div>

          <button className="cr-send" aria-label="send">
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

            <button
              className="cr-plus-item"
              type="button"
              aria-label="appointment"
              onClick={() => navigate(`/chat/${roomId}/appointment`)}
            >
              <div className="cr-plus-icon" aria-hidden="true">
                ⏰
              </div>
              <div className="cr-plus-label">약속</div>
            </button>
          </div>
        )}

        <div className="cr-keyboard-pad" />
      </div>
    </PhoneFrame>
  );
}
