// frontend/src/pages/AppointmentPage.tsx
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PhoneFrame from "../components/PhoneFrame";
import AppointmentMap from "../components/AppointmentMap";
import type { LatLng } from "../components/AppointmentMap";
import { fetchAppointmentByRoom, upsertAppointment } from "../api/chat";
import "./AppointmentPage.css";

/* =====================
 * Utils
 * ===================== */
const pad2 = (n: number) => String(n).padStart(2, "0");

const formatKoreanDate = (d: Date) =>
  `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${
    ["일", "월", "화", "수", "목", "금", "토"][d.getDay()]
  }요일`;

const formatTimeLabel = (h24: number, min: number) => {
  const isPM = h24 >= 12;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${isPM ? "오후" : "오전"} ${h12}:${pad2(min)}`;
};

/* =====================
 * Component
 * ===================== */
export default function AppointmentPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const location = useLocation();

  const partnerName =
    (location.state as { partnerName?: string })?.partnerName ?? "상대방";
  const numericRoomId = roomId ? Number(roomId) : NaN;

  /* =====================
   * State
   * ===================== */
  const [date, setDate] = useState<Date | null>(null);
  const [hour, setHour] = useState<number | null>(null);
  const [minute, setMinute] = useState(0);
  const [place, setPlace] = useState("");
  const [latLng, setLatLng] = useState<LatLng | null>(null);

  const [isPlaceOpen, setIsPlaceOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  /* =====================
   * Picker refs (중요)
   * ===================== */
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  /* =====================
   * Load existing appointment
   * ===================== */
  useEffect(() => {
    if (!Number.isFinite(numericRoomId)) return;

    fetchAppointmentByRoom(numericRoomId).then((res) => {
      const ap = res.data.data;
      if (!ap) return;

      if (ap.date) setDate(new Date(ap.date));
      if (ap.time) {
        const [h, m] = ap.time.split(":");
        setHour(Number(h));
        setMinute(Number(m));
      }
      if (ap.locationAddress) setPlace(ap.locationAddress);
    });
  }, [numericRoomId]);

  /* =====================
   * Derived
   * ===================== */
  const canSubmit = !!date && hour !== null && place.trim().length > 0;

  /* =====================
   * Submit
   * ===================== */
  const submit = async () => {
    if (!canSubmit || !Number.isFinite(numericRoomId)) return;

    try {
      setIsSaving(true);
      await upsertAppointment(numericRoomId, {
        date: date!.toISOString().slice(0, 10),
        time: `${pad2(hour!)}:${pad2(minute)}:00`,
        locationAddress: place,
      });
      navigate(-1);
    } finally {
      setIsSaving(false);
    }
  };

  /* =====================
   * Render
   * ===================== */
  return (
    <>
      <PhoneFrame className="ap-screen ap-screen-flex">
        {/* Header */}
        <header className="ap-header">
          <button className="ap-x" onClick={() => navigate(-1)}>
            ×
          </button>
          <div className="ap-title">{partnerName}님과 약속</div>
        </header>

        {/* Body */}
        <main className="ap-body">
          {/* 날짜 */}
          <div
            className="ap-row"
            onClick={() => dateInputRef.current?.click()}
          >
            <div className="ap-label">날짜</div>
            <div className={`ap-value ${date ? "filled" : ""}`}>
              {date ? formatKoreanDate(date) : "선택해주세요"}
            </div>
          </div>

          {/* 시간 */}
          <div
            className="ap-row"
            onClick={() => timeInputRef.current?.click()}
          >
            <div className="ap-label">시간</div>
            <div className={`ap-value ${hour !== null ? "filled" : ""}`}>
              {hour !== null
                ? formatTimeLabel(hour, minute)
                : "선택해주세요"}
            </div>
          </div>

          {/* 장소 */}
          <div
            className="ap-row"
            onClick={() => setIsPlaceOpen(true)}
          >
            <div className="ap-label">장소</div>
            <div className={`ap-value ${place ? "filled" : ""}`}>
              {place || "장소 선택"}
            </div>
          </div>

          {isPlaceOpen && (
            <div className="ap-panel ap-panel-map">
              <AppointmentMap
                value={latLng}
                onSelect={(pos, address) => {
                  setLatLng(pos);
                  setPlace(address);
                }}
              />
              <div className="ap-map-place">
                {place || "지도를 눌러 장소 선택"}
              </div>
            </div>
          )}
        </main>

        {/* Native pickers (hidden, 단 1번) */}
        <input
          ref={dateInputRef}
          type="date"
          className="ap-hidden-input"
          onChange={(e) => {
            if (!e.target.value) return;
            setDate(new Date(e.target.value));
          }}
        />

        <input
          ref={timeInputRef}
          type="time"
          className="ap-hidden-input"
          onChange={(e) => {
            if (!e.target.value) return;
            const [h, m] = e.target.value.split(":");
            setHour(Number(h));
            setMinute(Number(m));
          }}
        />
      </PhoneFrame>

      {/* Footer */}
      {createPortal(
        <div className="ap-footer-portal">
          <button
            className="ap-btn"
            disabled={!canSubmit || isSaving}
            onClick={submit}
          >
            {isSaving ? "저장 중..." : "약속 잡기"}
          </button>
        </div>,
        document.body
      )}
    </>
  );
}
