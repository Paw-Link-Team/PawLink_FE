import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Chatroom.css";

type Msg = {
  id: number;
  side: "left" | "right";
  text: string;
  time?: string;
};

export default function ChatRoomPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [input, setInput] = useState("");
  const [isPlusOpen, setIsPlusOpen] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  // ✅ 앨범/카메라 트리거용 input
  const albumInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const headerName = "강형욱";

  const messages: Msg[] = useMemo(
    () => [
      { id: 1, side: "right", text: "산책도움 지원합니다!" },
      { id: 2, side: "right", text: "저는 00동에 살고 산책경험이 있습니다!" },
      { id: 3, side: "left", text: "어디서 만날까요?", time: "오전 9:38" },
      {
        id: 4,
        side: "left",
        text: "내일 오후 3시 항승목록원 어떠신가요?",
        time: "오전 9:40",
      },
      { id: 5, side: "right", text: "좋습니다!", time: "오전 9:41" },
    ],
    []
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    });
  }, [roomId, isPlusOpen, isKeyboardOpen]);

  /* ✅ 플러스 버튼 */
  const togglePlus = () => {
    setIsPlusOpen((v) => !v);
    setIsKeyboardOpen(false);
  };

  /* ✅ 입력 포커스 → 키보드 모드 */
  const onFocusInput = () => {
    setIsKeyboardOpen(true);
    setIsPlusOpen(false);
  };

  const onBlurInput = () => {
    setIsKeyboardOpen(false);
  };

  // ✅ 앨범/카메라 열기 (모바일에서 동작)
  const openAlbum = () => {
    albumInputRef.current?.click();
  };

  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  // (지금은 선택만 받고, 실제 업로드/전송 로직은 나중에 연결)
  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // ✅ 같은 파일 다시 선택 가능하게 초기화
    e.target.value = "";
  };

  return (
    <div className="cr-wrapper">
      <div className="cr-screen">
        <div className="cr-status" />

        {/* ✅ 헤더 (팀 디자인) */}
        <header className="cr-topbar">
          <button
            className="cr-ico-btn"
            aria-label="back"
            onClick={() => navigate(-1)}
          >
            <span className="cr-back">‹</span>
          </button>

          <div className="cr-title-center">
            <div className="cr-name">{headerName}</div>
          </div>

          <button className="cr-ico-btn" aria-label="call">
            <span className="cr-call">☎</span>
          </button>
        </header>

        {/* ✅ 상단 게시글 카드 (팀 디자인) */}
        <section className="cr-post">
          <div className="cr-post-thumb" aria-hidden="true" />
          <div className="cr-post-texts">
            <div className="cr-post-title">산책 해주실 분 찾습니다</div>
            <div className="cr-post-sub">오후 3시 | 항승 푸른수목원</div>
          </div>
        </section>

        {/* 채팅 */}
        <div className="cr-chat" ref={listRef}>
          <div className="cr-date">2025년 11월 30일</div>

          {messages.map((m) => (
            <div key={m.id} className={`cr-row ${m.side}`}>
              {m.side === "left" && (
                <div className="cr-mini-ava" aria-hidden="true" />
              )}

              <div className="cr-bubble-wrap">
                {m.side === "left" && m.time && (
                  <div className="cr-time left">{m.time}</div>
                )}

                <div className={`cr-bubble ${m.side}`}>{m.text}</div>

                {m.side === "right" && m.time && (
                  <div className="cr-time right">{m.time}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ✅ 숨겨진 input들 (앨범/카메라) */}
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

        {/* 하단 입력 영역 */}
        <div
          className={`cr-bottom ${isPlusOpen ? "plus-open" : ""} ${
            isKeyboardOpen ? "keyboard-open" : ""
          }`}
        >
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

          {/* ✅ 플러스 패널: 앨범/카메라/약속 (지도 제거) */}
          {isPlusOpen && (
            <div className="cr-plus-panel">
              <button
                className="cr-plus-item"
                type="button"
                aria-label="album"
                onClick={openAlbum}
              >
                <div className="cr-plus-icon" aria-hidden="true">
                  🖼
                </div>
                <div className="cr-plus-label">앨범</div>
              </button>

              <button
                className="cr-plus-item"
                type="button"
                aria-label="camera"
                onClick={openCamera}
              >
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

        <div className="cr-home-indicator" />
      </div>
    </div>
  );
}
