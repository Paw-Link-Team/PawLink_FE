// frontend/src/pages/Appointment.tsx
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PhoneFrame from "../components/PhoneFrame";
import { fetchAppointmentByRoom, upsertAppointment, type AppointmentPayload } from "../api/chat";
import "./AppointmentPage.css";

type Panel = "date" | "time" | "place" | null;
type Step = "form" | "complete";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function formatKoreanDate(d: Date) {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const wk = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  return `${y}년 ${m}월 ${day}일 ${wk}요일`;
}
function formatShortDate(d: Date) {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const wk = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  return `${y}년 ${m}월 ${day}일 ${wk}요일`;
}
function formatTimeLabel(h24: number, min: number) {
  const isPM = h24 >= 12;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${isPM ? "오후" : "오전"} ${h12}:${pad2(min)}`;
}

const alarmOptions = [
  { label: "없음", minutes: 0 },
  { label: "5분 전", minutes: 5 },
  { label: "10분 전", minutes: 10 },
  { label: "15분 전", minutes: 15 },
  { label: "30분 전", minutes: 30 },
  { label: "1시간 전", minutes: 60 },
];

const minutesFromLabel = (label: string) => alarmOptions.find((opt) => opt.label === label)?.minutes ?? 15;
const labelFromMinutes = (minutes?: number | null) => alarmOptions.find((opt) => opt.minutes === minutes)?.label ?? "15분 전";

/** ✅ Wheel Column */
function WheelColumn({
  items,
  index,
  onChange,
  ariaLabel,
  onTouched,
}: {
  items: string[];
  index: number;
  onChange: (i: number) => void;
  ariaLabel: string;
  onTouched?: () => void;
}) {
  const ITEM_H = 36;
  const boxRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    el.scrollTo({ top: index * ITEM_H, behavior: "auto" });
  }, [index]);

  const onScroll = () => {
    const el = boxRef.current;
    if (!el) return;

    onTouched?.();

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const i = Math.round(el.scrollTop / ITEM_H);
      const clamped = Math.max(0, Math.min(items.length - 1, i));
      onChange(clamped);
    });
  };

  const onScrollEndSnap = () => {
    const el = boxRef.current;
    if (!el) return;
    const i = Math.round(el.scrollTop / ITEM_H);
    const clamped = Math.max(0, Math.min(items.length - 1, i));
    el.scrollTo({ top: clamped * ITEM_H, behavior: "smooth" });
  };

  return (
    <div className="ap-wheel-col" aria-label={ariaLabel}>
      <div className="ap-wheel-fade top" aria-hidden="true" />
      <div className="ap-wheel-fade bottom" aria-hidden="true" />
      <div className="ap-wheel-highlight" aria-hidden="true" />

      <div
        ref={boxRef}
        className="ap-wheel-scroll"
        onScroll={onScroll}
        onPointerUp={onScrollEndSnap}
        onMouseUp={onScrollEndSnap}
        onTouchEnd={onScrollEndSnap}
      >
        {items.map((t, i) => (
          <div key={`${t}-${i}`} className={`ap-wheel-item ${i === index ? "active" : ""}`}>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AppointmentPage() {
  const nav = useNavigate();
  const { roomId } = useParams();
  const location = useLocation();
  const partnerName = (location.state as { partnerName?: string } | undefined)?.partnerName ?? "강형욱";
  const headerName = partnerName;
  const numericRoomId = roomId ? Number(roomId) : NaN;

  const [step, setStep] = useState<Step>("form");
  const [openPanel, setOpenPanel] = useState<Panel>(null);

  // 최종 선택값
  const [date, setDate] = useState<Date | null>(null);
  const [hour, setHour] = useState<number | null>(null);
  const [minute, setMinute] = useState<number>(0);
  const [place, setPlace] = useState<string>("");
  const [alarm, setAlarm] = useState<string>("15분 전");
  const [loadingAppointment, setLoadingAppointment] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const canBook = !!date && hour !== null && place.trim().length > 0;

  // 날짜 임시
  const today = useMemo(() => new Date(), []);
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [tempDate, setTempDate] = useState<Date | null>(null);

  // 시간 임시 (휠)
  const meridiems = ["오전", "오후"];
  const hours12 = Array.from({ length: 12 }, (_, i) => pad2(i + 1));
  const minutesList = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(pad2);

  const [tempMerIdx, setTempMerIdx] = useState(1);
  const [tempHourIdx, setTempHourIdx] = useState(2);
  const [tempMinIdx, setTempMinIdx] = useState(0);

  // 장소 임시
  const [tempPlace, setTempPlace] = useState("");

  // ✅ “선택했으면 갈색 확인”을 위한 플래그
  const [datePicked, setDatePicked] = useState(false);
  const [timePicked, setTimePicked] = useState(false);
  const [placePicked, setPlacePicked] = useState(false);

  const tempHour24 = useMemo(() => {
    const h12 = Number(hours12[tempHourIdx]);
    const isPM = tempMerIdx === 1;
    if (isPM) return h12 === 12 ? 12 : h12 + 12;
    return h12 === 12 ? 0 : h12;
  }, [tempMerIdx, tempHourIdx, hours12]);

  const tempMinute = useMemo(() => Number(minutesList[tempMinIdx]), [tempMinIdx, minutesList]);

  const calendarCells = useMemo(() => {
    const first = new Date(calYear, calMonth, 1);
    const firstDay = first.getDay();
    const last = new Date(calYear, calMonth + 1, 0);
    const daysInMonth = last.getDate();

    const cells: Array<{ day: number | null; dateObj?: Date }> = [];
    for (let i = 0; i < firstDay; i++) cells.push({ day: null });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, dateObj: new Date(calYear, calMonth, d) });
    while (cells.length % 7 !== 0) cells.push({ day: null });
    return cells;
  }, [calYear, calMonth]);

  const hydrateFromServer = (payload: AppointmentPayload) => {
    if (payload.date) {
      const parsed = new Date(payload.date);
      if (!Number.isNaN(parsed.getTime())) {
        setDate(parsed);
        setDatePicked(true);
      }
    }

    if (payload.time) {
      const [hStr = "0", mStr = "0"] = payload.time.split(":");
      const parsedH = Number(hStr);
      const parsedM = Number(mStr);
      if (!Number.isNaN(parsedH)) {
        setHour(parsedH);
        setTimePicked(true);
      }
      if (!Number.isNaN(parsedM)) {
        setMinute(parsedM);
      }
    }

    if (payload.locationAddress) {
      setPlace(payload.locationAddress);
      setPlacePicked(true);
    }

    if (typeof payload.reminderMinutesBefore === "number") {
      setAlarm(labelFromMinutes(payload.reminderMinutesBefore));
    }
  };

  useEffect(() => {
    if (!Number.isFinite(numericRoomId)) {
      setLoadingAppointment(false);
      setFormError("유효하지 않은 채팅방입니다.");
      return;
    }

    let ignore = false;
    const load = async () => {
      try {
        setLoadingAppointment(true);
        const response = await fetchAppointmentByRoom(numericRoomId);
        if (ignore) return;
        const data = response.data.data;
        if (data) {
          hydrateFromServer(data);
        }
        setFormError(null);
      } catch (err) {
        if (ignore) return;
        console.error("약속 정보를 불러오지 못했습니다.", err);
        setFormError("약속 정보를 불러오지 못했습니다.");
      } finally {
        if (!ignore) setLoadingAppointment(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [numericRoomId]);

  const close = () => nav(-1);

  const togglePanel = (p: Exclude<Panel, null>) => {
    if (openPanel === p) {
      setOpenPanel(null);
      return;
    }

    if (p === "date") {
      const base = date ?? today;
      setCalYear(base.getFullYear());
      setCalMonth(base.getMonth());
      setTempDate(date ?? null);
      setDatePicked(!!date);
    }

    if (p === "time") {
      const h24 = hour ?? 15;
      const isPM = h24 >= 12;
      const h12 = h24 % 12 === 0 ? 12 : h24 % 12;

      setTempMerIdx(isPM ? 1 : 0);
      setTempHourIdx(Math.max(0, Math.min(11, h12 - 1)));

      const minIdx = minutesList.findIndex((m) => Number(m) === (minute ?? 0));
      setTempMinIdx(minIdx >= 0 ? minIdx : 0);

      setTimePicked(hour !== null);
    }

    if (p === "place") {
      setTempPlace(place ?? "");
      setPlacePicked(!!place);
    }

    setOpenPanel(p);
  };

  // ✅ 패널별 “확인” 버튼 활성 조건
  const canConfirm =
    openPanel === "date"
      ? !!tempDate && datePicked
      : openPanel === "time"
        ? timePicked
        : openPanel === "place"
          ? tempPlace.trim().length > 0 && placePicked
          : false;

  const confirmCurrentPanel = () => {
    if (!openPanel) return;

    if (openPanel === "date") {
      if (!tempDate) return;
      setDate(tempDate);
      setOpenPanel(null);
      return;
    }

    if (openPanel === "time") {
      setHour(tempHour24);
      setMinute(tempMinute);
      setOpenPanel(null);
      return;
    }

    if (openPanel === "place") {
      if (!tempPlace.trim()) return;
      setPlace(tempPlace.trim());
      setOpenPanel(null);
      return;
    }
  };

  const buildPayload = (): AppointmentPayload => ({
    date: date ? date.toISOString().slice(0, 10) : "",
    time: `${pad2(hour ?? 0)}:${pad2(minute)}:00`,
    locationAddress: place.trim(),
    reminderMinutesBefore: minutesFromLabel(alarm),
  });

  const submitAppointment = async () => {
    if (!canBook || !Number.isFinite(numericRoomId)) {
      setFormError("약속을 저장할 수 없습니다. 입력을 다시 확인해주세요.");
      return;
    }

    try {
      setIsSaving(true);
      setFormError(null);
      await upsertAppointment(numericRoomId, buildPayload());
      setOpenPanel(null);
      setStep("complete");
    } catch (err) {
      console.error("약속 저장 실패", err);
      setFormError("약속 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ 하단 버튼: 패널 열림이면 “확인”, 닫힘이면 “약속 잡기”
  const bottomLabel = openPanel ? "확인" : isSaving ? "저장 중..." : "약속 잡기";
  const bottomDisabled = openPanel ? !canConfirm : !canBook || isSaving || !Number.isFinite(numericRoomId);
  const bottomOnClick = openPanel ? confirmCurrentPanel : submitAppointment;

  return (
    <>
      <PhoneFrame className="ap-screen ap-screen-flex">
        <div className="ap-status" />

        {step !== "complete" && (
          <header className="ap-header">
            <button className="ap-x" onClick={close} aria-label="close" type="button">
              ×
            </button>
            <div className="ap-title">{headerName}님과 약속</div>
          </header>
        )}

        {step === "form" && (
          <div className="ap-scroll">
            <main className="ap-body">
              {(formError || loadingAppointment) && (
                <div style={{ marginBottom: 12 }}>
                  {formError && (
                    <p style={{ color: "#b3261e", fontSize: 12, margin: 0 }}>{formError}</p>
                  )}
                  {loadingAppointment && (
                    <p style={{ color: "#7a4a22", fontSize: 12, margin: formError ? "4px 0 0" : 0 }}>
                      약속 정보를 불러오는 중입니다...
                    </p>
                  )}
                </div>
              )}

              {/* 날짜 */}
              <div
                className={`ap-row ${openPanel === "date" ? "open" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => togglePanel("date")}
              >
                <div className="ap-label">날짜</div>
                <div className={`ap-value ${date ? "filled" : ""}`}>{date ? formatShortDate(date) : "선택해주세요"}</div>
                <div className="ap-right">▾</div>
              </div>

              {openPanel === "date" && (
                <div className="ap-panel">
                  <div className="ap-calendar">
                    <div className="ap-cal-head">
                      <button
                        className="ap-cal-nav"
                        onClick={() => {
                          const prev = new Date(calYear, calMonth - 1, 1);
                          setCalYear(prev.getFullYear());
                          setCalMonth(prev.getMonth());
                        }}
                        type="button"
                      >
                        ‹
                      </button>

                      <div className="ap-cal-title">
                        {calYear}년 {calMonth + 1}월
                      </div>

                      <button
                        className="ap-cal-nav"
                        onClick={() => {
                          const next = new Date(calYear, calMonth + 1, 1);
                          setCalYear(next.getFullYear());
                          setCalMonth(next.getMonth());
                        }}
                        type="button"
                      >
                        ›
                      </button>
                    </div>

                    <div className="ap-cal-week">
                      {["일", "월", "화", "수", "목", "금", "토"].map((w) => (
                        <div key={w} className={`ap-cal-w ${w === "일" ? "sun" : w === "토" ? "sat" : ""}`}>
                          {w}
                        </div>
                      ))}
                    </div>

                    <div className="ap-cal-grid">
                      {calendarCells.map((c, idx) => {
                        const isSelected =
                          !!c.dateObj &&
                          !!tempDate &&
                          c.dateObj.getFullYear() === tempDate.getFullYear() &&
                          c.dateObj.getMonth() === tempDate.getMonth() &&
                          c.dateObj.getDate() === tempDate.getDate();

                        return (
                          <button
                            key={idx}
                            className={`ap-cal-cell ${c.day ? "" : "empty"} ${isSelected ? "selected" : ""}`}
                            disabled={!c.day}
                            onClick={() => {
                              if (!c.dateObj) return;
                              setTempDate(c.dateObj);
                              setDatePicked(true);
                            }}
                            type="button"
                          >
                            {c.day ?? ""}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 시간 */}
              <div
                className={`ap-row ${openPanel === "time" ? "open" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => togglePanel("time")}
              >
                <div className="ap-label">시간</div>
                <div className={`ap-value ${hour !== null ? "filled" : ""}`}>
                  {hour !== null ? formatTimeLabel(hour, minute) : "선택해주세요"}
                </div>
                <div className="ap-right">▾</div>
              </div>

              {openPanel === "time" && (
                <div className="ap-panel">
                  <div className="ap-row ap-row-static">
                    <div className="ap-label">시간</div>
                    <div className="ap-value filled">{formatTimeLabel(tempHour24, tempMinute)}</div>
                    <div />
                  </div>

                  <div className="ap-wheel">
                    <div className="ap-wheel-head">오전/오후</div>
                    <div className="ap-wheel-head">시</div>
                    <div className="ap-wheel-head">분</div>

                    <WheelColumn items={meridiems} index={tempMerIdx} onChange={setTempMerIdx} ariaLabel="오전/오후" onTouched={() => setTimePicked(true)} />
                    <WheelColumn items={hours12} index={tempHourIdx} onChange={setTempHourIdx} ariaLabel="시" onTouched={() => setTimePicked(true)} />
                    <WheelColumn items={minutesList} index={tempMinIdx} onChange={setTempMinIdx} ariaLabel="분" onTouched={() => setTimePicked(true)} />
                  </div>
                </div>
              )}

              {/* 장소 */}
              <div
                className={`ap-row ${openPanel === "place" ? "open" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => togglePanel("place")}
              >
                <div className="ap-label">장소</div>
                <div className={`ap-value ${place ? "filled" : ""}`}>{place ? place : "장소 선택"}</div>
                <div className="ap-right">▾</div>
              </div>

              {openPanel === "place" && (
                <div className="ap-panel ap-panel-map">
                  <div
                    className={`ap-place-card ${tempPlace === "항동 푸른수목원" ? "selected" : ""}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setTempPlace("항동 푸른수목원");
                      setPlacePicked(true);
                    }}
                  >
                    <div className="ap-place-title">항동 푸른수목원</div>
                    <div className="ap-place-sub">장소 선택</div>
                    <div className="ap-place-check" aria-hidden="true" />
                  </div>

                  <div className="ap-map">
                    <div className="ap-map-pin" aria-hidden="true" />
                    <div className="ap-map-label">푸른수목원</div>
                  </div>
                </div>
              )}

              {/* 알림 */}
              <div className="ap-row ap-row-select">
                <div className="ap-label">약속 전 나에게 알림</div>
                <select className="ap-select" value={alarm} onChange={(e) => setAlarm(e.target.value)}>
                  {alarmOptions.map((option) => (
                    <option key={option.minutes} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="ap-right">▾</div>
              </div>
            </main>
          </div>
        )}

        {step === "complete" && (
          <main className="ap-complete">
            <div className="ap-complete-icon" aria-hidden="true">
              🐾
            </div>

            <div className="ap-complete-title">
              {headerName} 님과
              <br />
              약속이 완료되었습니다!
            </div>

            <div className="ap-summary">
              <div className="ap-srow">
                <div className="ap-slabel">날짜</div>
                <div className="ap-svalue">{date ? formatKoreanDate(date) : "-"}</div>
              </div>
              <div className="ap-srow">
                <div className="ap-slabel">시간</div>
                <div className="ap-svalue">{hour !== null ? formatTimeLabel(hour, minute) : "-"}</div>
              </div>
              <div className="ap-srow">
                <div className="ap-slabel">장소</div>
                <div className="ap-svalue">{place || "-"}</div>
              </div>
              <div className="ap-srow">
                <div className="ap-slabel">약속 전 나에게 알림</div>
                <div className="ap-svalue">{alarm}</div>
              </div>
            </div>
          </main>
        )}

        <div className="ap-home-indicator" />
      </PhoneFrame>

      {/* ✅ Portal Footer */}
      {step !== "complete" &&
        createPortal(
          <div className="ap-footer-portal">
            <button
              className={`ap-btn ${bottomDisabled ? "disabled" : ""}`}
              onClick={bottomOnClick}
              disabled={bottomDisabled}
              type="button"
            >
              {bottomLabel}
            </button>
          </div>,
          document.body
        )}

      {step === "complete" &&
        createPortal(
          <div className="ap-footer-portal">
            <button className="ap-btn" onClick={close} type="button">
              완료
            </button>
          </div>,
          document.body
        )}
    </>
  );
}
