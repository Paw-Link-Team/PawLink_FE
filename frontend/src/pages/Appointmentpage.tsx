import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AppointmentPage.css";

type Step = "form" | "date" | "time" | "place" | "complete";

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

export default function AppointmentPage() {
  const nav = useNavigate();

  const headerName = "강형욱";

  const [step, setStep] = useState<Step>("form");

  // 최종 선택값
  const [date, setDate] = useState<Date | null>(null);
  const [hour, setHour] = useState<number | null>(null); // 0-23
  const [minute, setMinute] = useState<number>(0);
  const [place, setPlace] = useState<string>(""); // "항동 푸른수목원"
  const [alarm, setAlarm] = useState<string>("15분 전");

  // 날짜 선택(임시)
  const today = useMemo(() => new Date(), []);
  const [calYear, setCalYear] = useState<number>(today.getFullYear());
  const [calMonth, setCalMonth] = useState<number>(today.getMonth()); // 0-11
  const [tempDate, setTempDate] = useState<Date | null>(null);

  // 시간 선택(임시)
  const [tempHour, setTempHour] = useState<number>(15);
  const [tempMinute, setTempMinute] = useState<number>(0);

  const canBook = !!date && hour !== null && place.trim().length > 0;

  // 캘린더 그리드
  const calendarCells = useMemo(() => {
    const first = new Date(calYear, calMonth, 1);
    const firstDay = first.getDay(); // 0=일
    const last = new Date(calYear, calMonth + 1, 0);
    const daysInMonth = last.getDate();

    const cells: Array<{ day: number | null; dateObj?: Date }> = [];
    for (let i = 0; i < firstDay; i++) cells.push({ day: null });
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, dateObj: new Date(calYear, calMonth, d) });
    }
    while (cells.length % 7 !== 0) cells.push({ day: null });
    return cells;
  }, [calYear, calMonth]);

  const openDate = () => {
    const base = date ?? today;
    setCalYear(base.getFullYear());
    setCalMonth(base.getMonth());
    setTempDate(date ?? null);
    setStep("date");
  };

  const openTime = () => {
    setTempHour(hour ?? 15);
    setTempMinute(minute ?? 0);
    setStep("time");
  };

  const openPlace = () => {
    setStep("place");
  };

  const confirmDate = () => {
    if (!tempDate) return;
    setDate(tempDate);
    setStep("form");
  };

  const confirmTime = () => {
    setHour(tempHour);
    setMinute(tempMinute);
    setStep("form");
  };

  const selectPlace = () => {
    // ✅ 스샷과 동일한 장소로 고정(나중에 지도 API 붙일 때 여기만 바꾸면 됨)
    setPlace("항동 푸른수목원");
    setStep("form");
  };

  const onBook = () => {
    if (!canBook) return;
    setStep("complete");
  };

  const close = () => nav(-1);

  return (
    <div className="ap-wrapper">
      <div className="ap-screen">
        <div className="ap-status" />

    {/* 헤더 (완료 화면에서는 숨김) */}
    {step !== "complete" && (
      <header className="ap-header">
        <button className="ap-x" onClick={close} aria-label="close">
          ×
        </button>
        <div className="ap-title">{headerName}님과 약속</div>
    </header>
    )}


        {/* =========================
            FORM (기본 화면)
           ========================= */}
        {step === "form" && (
          <>
            <main className="ap-body">
              <div className="ap-row" onClick={openDate} role="button" tabIndex={0}>
                <div className="ap-label">날짜</div>
                <div className={`ap-value ${date ? "filled" : ""}`}>
                  {date ? formatShortDate(date) : "선택해주세요"}
                </div>
                <div className="ap-right">▾</div>
              </div>

              <div className="ap-row" onClick={openTime} role="button" tabIndex={0}>
                <div className="ap-label">시간</div>
                <div className={`ap-value ${hour !== null ? "filled" : ""}`}>
                  {hour !== null ? formatTimeLabel(hour, minute) : "선택해주세요"}
                </div>
                <div className="ap-right">▾</div>
              </div>

              <div className="ap-row" onClick={openPlace} role="button" tabIndex={0}>
                <div className="ap-label">장소</div>
                <div className={`ap-value ${place ? "filled" : ""}`}>
                  {place ? place : "장소 선택"}
                </div>
                <div className="ap-right">›</div>
              </div>

              <div className="ap-row ap-row-select">
                <div className="ap-label">약속 전 나에게 알림</div>

                <select
                  className="ap-select"
                  value={alarm}
                  onChange={(e) => setAlarm(e.target.value)}
                >
                  <option>없음</option>
                  <option>5분 전</option>
                  <option>10분 전</option>
                  <option>15분 전</option>
                  <option>30분 전</option>
                  <option>1시간 전</option>
                </select>

                <div className="ap-right">▾</div>
              </div>
            </main>

            <div className="ap-footer">
              <button
                className={`ap-btn ${canBook ? "" : "disabled"}`}
                onClick={onBook}
                disabled={!canBook}
              >
                약속잡기
              </button>
            </div>
          </>
        )}

        {/* =========================
            DATE (달력 화면)
           ========================= */}
        {step === "date" && (
          <>
            <main className="ap-body ap-body-picker">
              <div className="ap-row ap-row-static">
                <div className="ap-label">날짜</div>
                <div className={`ap-value ${tempDate ? "filled" : ""}`}>
                  {tempDate ? formatKoreanDate(tempDate) : "선택해주세요"}
                </div>
                <div className="ap-right">▾</div>
              </div>

              <div className="ap-calendar">
                <div className="ap-cal-head">
                  <button
                    className="ap-cal-nav"
                    onClick={() => {
                      const prev = new Date(calYear, calMonth - 1, 1);
                      setCalYear(prev.getFullYear());
                      setCalMonth(prev.getMonth());
                    }}
                    aria-label="prev"
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
                    aria-label="next"
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
                        className={`ap-cal-cell ${c.day ? "" : "empty"} ${
                          isSelected ? "selected" : ""
                        }`}
                        disabled={!c.day}
                        onClick={() => c.dateObj && setTempDate(c.dateObj)}
                      >
                        {c.day ?? ""}
                      </button>
                    );
                  })}
                </div>
              </div>
            </main>

            <div className="ap-footer">
              <button
                className={`ap-btn ${tempDate ? "" : "disabled"}`}
                onClick={confirmDate}
                disabled={!tempDate}
              >
                확인
              </button>
            </div>
          </>
        )}

        {/* =========================
            TIME (시간 화면)
           ========================= */}
        {step === "time" && (
          <>
            <main className="ap-body ap-body-picker">
              <div className="ap-row ap-row-static">
                <div className="ap-label">날짜</div>
                <div className={`ap-value ${date ? "filled" : ""}`}>
                  {date ? formatKoreanDate(date) : "선택해주세요"}
                </div>
                <div className="ap-right">▾</div>
              </div>

              <div className="ap-row ap-row-static">
                <div className="ap-label">시간</div>
                <div className={`ap-value ${true ? "filled" : ""}`}>
                  {formatTimeLabel(tempHour, tempMinute)}
                </div>
                <div className="ap-right">▾</div>
              </div>

              <div className="ap-time">
                <div className="ap-time-col">
                  <div className="ap-time-head">오전/오후</div>
                  <select
                    className="ap-time-select"
                    value={tempHour >= 12 ? "PM" : "AM"}
                    onChange={(e) => {
                      const isPM = e.target.value === "PM";
                      const h12 = tempHour % 12 === 0 ? 12 : tempHour % 12;
                      setTempHour(isPM ? (h12 === 12 ? 12 : h12 + 12) : (h12 === 12 ? 0 : h12));
                    }}
                  >
                    <option value="AM">오전</option>
                    <option value="PM">오후</option>
                  </select>
                </div>

                <div className="ap-time-col">
                  <div className="ap-time-head">시</div>
                  <select
                    className="ap-time-select"
                    value={tempHour % 12 === 0 ? 12 : tempHour % 12}
                    onChange={(e) => {
                      const h = Number(e.target.value); // 1-12
                      const isPM = tempHour >= 12;
                      setTempHour(isPM ? (h === 12 ? 12 : h + 12) : (h === 12 ? 0 : h));
                    }}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                      <option key={h} value={h}>
                        {pad2(h)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ap-time-col">
                  <div className="ap-time-head">분</div>
                  <select
                    className="ap-time-select"
                    value={tempMinute}
                    onChange={(e) => setTempMinute(Number(e.target.value))}
                  >
                    {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
                      <option key={m} value={m}>
                        {pad2(m)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </main>

            <div className="ap-footer">
              <button className="ap-btn" onClick={confirmTime}>
                시간 선택
              </button>
            </div>
          </>
        )}

        {/* =========================
            PLACE (장소 화면)
           ========================= */}
        {step === "place" && (
          <>
            <main className="ap-body ap-body-picker ap-body-map">
              <div className="ap-map">
                <div className="ap-map-pin" aria-hidden="true" />
                <div className="ap-map-label">푸른수목원</div>
              </div>
            </main>

            <div className="ap-footer">
              <button className="ap-btn" onClick={selectPlace}>
                장소 선택
              </button>
            </div>
          </>
        )}

        {/* =========================
            COMPLETE (완료 화면)
           ========================= */}
        {step === "complete" && (
          <>
            <main className="ap-complete">
              <button className="ap-x ap-x-abs" onClick={close} aria-label="close">
                ×
              </button>

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
                  <div className="ap-svalue">
                    {hour !== null ? formatTimeLabel(hour, minute) : "-"}
                  </div>
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

            <div className="ap-footer ap-footer-complete">
              <button className="ap-btn" onClick={close}>
                완료
              </button>
            </div>
          </>
        )}

        <div className="ap-home-indicator" />
      </div>
    </div>
  );
}
