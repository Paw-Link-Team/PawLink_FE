import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Chatroom.css";

type Msg = {
  id: number;
  side: "left" | "right";
  text: string;
  time?: string; // "오전 9:38" 같은 형태
};

export default function ChatRoomPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [input, setInput] = useState("");
  const [isPlusOpen, setIsPlusOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  const headerName = "김파우";
  const headerSub = "보호 10분 이내에 응답";

  const messages: Msg[] = useMemo(
    () => [
      { id: 1, side: "right", text: "산책도움 지원합니다!", time: "" },
      { id: 2, side: "right", text: "저는 00동에 살고 산책경험이 있습니다!", time: "" },
      { id: 3, side: "left", text: "어디서 만날까요?", time: "오전 9:38" },
      { id: 4, side: "left", text: "내일 오후 3시 황송목록원 어떠신가요?", time: "오전 9:40" },
      { id: 5, side: "right", text: "좋습니다!", time: "오전 9:41" },
    ],
    []
  );

  useEffect(() => {
    // 새 메시지 / 진입 시 아래로 스크롤
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    });
  }, [roomId]);

  const handleTogglePlus = () => {
    setIsPlusOpen((v) => !v);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsPlusOpen(false);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    // 지금은 UI용: 실제 메시지 push는 추후 상태관리/서버 붙일 때
    setInput("");
  };

  return (
    <div className="cr-wrapper">
      <div className="cr-screen">
        {/* 상태바 여백 */}
        <div className="cr-status" />

        {/* 상단 헤더 */}
        <header className="cr-topbar">
          <button className="cr-ico-btn" onClick={() => navigate(-1)} aria-label="back">
            ‹
          </button>

          <div className="cr-title">
            <div className="cr-name">{headerName}</div>
            <div className="cr-sub">{headerSub}</div>
          </div>

          <button className="cr-ico-btn" aria-label="call">
            ☎
          </button>
        </header>

        {/* 상단 프로필 배너 */}
        <section className="cr-profile">
          <div className="cr-profile-left">
            <div className="cr-badge">산책자</div>
            <div className="cr-profile-title">산책 해주실 분 찾습니다</div>
            <div className="cr-profile-sub">오후 3시 | 황송목록원</div>
          </div>
          <div className="cr-profile-ava">👤</div>
        </section>

        {/* 대화 영역 */}
        <div className="cr-chat" ref={listRef}>
          <div className="cr-date">2025년 11월 30일</div>

          {messages.map((m) => (
            <div key={m.id} className={`cr-row ${m.side}`}>
              {m.side === "left" && <div className="cr-mini-ava">👤</div>}

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

        {/* 하단 입력 영역 */}
        <div className={`cr-bottom ${isPlusOpen ? "plus-open" : ""} ${isFocused ? "focused" : ""}`}>
          <div className="cr-inputbar">
            <button className="cr-plus" onClick={handleTogglePlus} aria-label="plus">
              +
            </button>

            <div className="cr-inputbox">
              <span className="cr-paw">🐾</span>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="산책시 리드줄은 필수예요!"
              />
            </div>

            <button className="cr-send" onClick={handleSend} aria-label="send">
              ▷
            </button>
          </div>

          {/* 플러스 패널 */}
          {isPlusOpen && (
            <div className="cr-plus-panel">
              <button className="cr-plus-item">
                <div className="cr-plus-icon">🖼</div>
                <div className="cr-plus-label">앨범</div>
              </button>
              <button className="cr-plus-item">
                <div className="cr-plus-icon">📷</div>
                <div className="cr-plus-label">카메라</div>
              </button>
              <button className="cr-plus-item">
                <div className="cr-plus-icon">📍</div>
                <div className="cr-plus-label">지도</div>
              </button>
              <button className="cr-plus-item">
                <div className="cr-plus-icon">⏰</div>
                <div className="cr-plus-label">약속</div>
              </button>
            </div>
          )}
        </div>

        {/* iOS 홈 인디케이터 */}
        <div className="cr-home-indicator" />
      </div>
    </div>
  );
}
