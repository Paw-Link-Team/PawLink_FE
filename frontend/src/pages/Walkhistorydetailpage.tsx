import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import "./Walkhistorydetailpage.css";

export default function WalkHistoryDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // 더미 상세(나중에 API 붙이면 교체)
  const detail = {
    id,
    date: "2025. 12. 5",
    distance: "0.6 km",
    duration: "00:18:24",
    poop: "X",
    memo: "메모가 들어갈 자리입니다.",
  };

  return (
    <div className="wh-wrapper">
      <div className="wh-screen">
        <div className="wh-status" />

        <header className="wh-top">
          <button className="wh-back" onClick={() => navigate(-1)}>
            ‹
          </button>
          <div className="wh-title">산책 히스토리</div>
          <div className="wh-right" />
        </header>

        <section className="wh-card">
          <div className="wh-row">
            <span className="wh-label">날짜</span>
            <span className="wh-value">{detail.date}</span>
          </div>
          <div className="wh-row">
            <span className="wh-label">거리</span>
            <span className="wh-value">{detail.distance}</span>
          </div>
          <div className="wh-row">
            <span className="wh-label">시간</span>
            <span className="wh-value">{detail.duration}</span>
          </div>
          <div className="wh-row">
            <span className="wh-label">배변</span>
            <span className="wh-value">{detail.poop}</span>
          </div>
        </section>

        <section className="wh-map">
          <div className="wh-map-title">산책 경로</div>
          <div className="wh-map-box">지도 영역(임시)</div>
        </section>

        <section className="wh-memo">
          <div className="wh-map-title">메모</div>
          <div className="wh-memo-box">{detail.memo}</div>
        </section>

        <NavBar active="mypage" />
        <div className="wh-safe" />
      </div>
    </div>
  );
}
