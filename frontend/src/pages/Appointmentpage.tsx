import { useNavigate } from "react-router-dom";
import "./AppointmentPage.css";

export default function AppointmentPage() {
  const nav = useNavigate();

  return (
    <div className="ap-wrapper">
      <div className="ap-screen">
        <div className="ap-status" />

        {/* 헤더 */}
        <header className="ap-header">
          <button className="ap-back" onClick={() => nav(-1)}>×</button>
          <div className="ap-title">강형욱님과 약속</div>
        </header>

        {/* 폼 */}
        <main className="ap-body">
          <div className="ap-field">
            <label>날짜</label>
            <div className="ap-input">선택해주세요 ▾</div>
          </div>

          <div className="ap-field">
            <label>시간</label>
            <div className="ap-input">선택해주세요 ▾</div>
          </div>

          <div className="ap-field">
            <label>장소</label>
            <div className="ap-input">장소 선택 ▸</div>
          </div>

          <div className="ap-field">
            <label>약속 전 나에게 알림</label>
            <div className="ap-input">15분 전 ▾</div>
          </div>
        </main>

        {/* 하단 버튼 */}
        <div className="ap-footer">
          <button className="ap-btn disabled">약속 잡기</button>
        </div>

        <div className="ap-home-indicator" />
      </div>
    </div>
  );
}
