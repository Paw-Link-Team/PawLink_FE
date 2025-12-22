import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneFrame from "../components/PhoneFrame";
import "./ChargePage.css";

type Step = "input" | "confirm" | "done";

export default function Chargepage() {
  const nav = useNavigate();

  const accountName = "내 명명은행 계좌에서";
  const accountNo = useMemo(() => "12345678987456", []);

  const [step, setStep] = useState<Step>("input");
  const [digits, setDigits] = useState<string>(""); // 숫자만 저장 (콤마 X)

  const amountNum = useMemo(() => Number(digits || "0"), [digits]);
  const amountText = useMemo(() => {
    if (!digits) return "";
    return amountNum.toLocaleString("ko-KR");
  }, [digits, amountNum]);

  const canSubmit = amountNum > 0;

  const addDigits = (v: string) => {
    const next = (digits + v).replace(/^0+(\d)/, "$1");
    if (next.length > 12) return;
    setDigits(next);
  };

  const backspace = () => {
    if (!digits) return;
    setDigits(digits.slice(0, -1));
  };

  const resetAndGoBack = () => {
    setStep("input");
    setDigits("");
    nav(-1);
  };

  return (
    <PhoneFrame className="cp-frame">
      <div className="cp-root">
        <div className="cp-phone">
          {/* Top bar */}
          <header className="cp-top">
            <button className="cp-x" type="button" onClick={resetAndGoBack} aria-label="close">
              ✕
            </button>
            <div className="cp-title">충전</div>
            <div className="cp-top-right" />
          </header>

          {/* Content */}
          <main className="cp-main">
            <div className="cp-bank">
              <div className="cp-paw" aria-hidden />
              <div className="cp-bank-text">
                <div className="cp-bank-name">{accountName}</div>
                <div className="cp-bank-no">{accountNo}</div>
              </div>
            </div>

            {/* Amount */}
            {!digits ? (
              <>
                <div className="cp-ask">얼마를 충전 할까요?</div>
                <div className="cp-sub">현재 잔액 0원</div>
              </>
            ) : (
              <>
                <div className="cp-amount">
                  <span className="cp-amount-num">{amountText}</span>
                  <span className="cp-amount-won">원</span>
                </div>
                <div className="cp-sub">현재 잔액 0원</div>
              </>
            )}

            {/* Keypad */}
            <section className="cp-keypad" aria-label="keypad">
              <div className="cp-key-row">
                <button className="cp-key" onClick={() => addDigits("1")} type="button">
                  1
                </button>
                <button className="cp-key" onClick={() => addDigits("2")} type="button">
                  2
                </button>
                <button className="cp-key" onClick={() => addDigits("3")} type="button">
                  3
                </button>
              </div>
              <div className="cp-key-row">
                <button className="cp-key" onClick={() => addDigits("4")} type="button">
                  4
                </button>
                <button className="cp-key" onClick={() => addDigits("5")} type="button">
                  5
                </button>
                <button className="cp-key" onClick={() => addDigits("6")} type="button">
                  6
                </button>
              </div>
              <div className="cp-key-row">
                <button className="cp-key" onClick={() => addDigits("7")} type="button">
                  7
                </button>
                <button className="cp-key" onClick={() => addDigits("8")} type="button">
                  8
                </button>
                <button className="cp-key" onClick={() => addDigits("9")} type="button">
                  9
                </button>
              </div>
              <div className="cp-key-row">
                <button className="cp-key" onClick={() => addDigits("00")} type="button">
                  00
                </button>
                <button className="cp-key" onClick={() => addDigits("0")} type="button">
                  0
                </button>
                <button
                  className="cp-key cp-key-back"
                  onClick={backspace}
                  type="button"
                  aria-label="backspace"
                >
                  ←
                </button>
              </div>
            </section>
          </main>

          {/* Bottom button */}
          <footer className="cp-bottom">
            <button
              className={`cp-submit ${canSubmit ? "on" : ""}`}
              type="button"
              disabled={!canSubmit}
              onClick={() => setStep("confirm")}
            >
              충전하기
            </button>
          </footer>

          {/* Confirm / Done Bottom Sheet */}
          {(step === "confirm" || step === "done") && (
            <div className="cp-dim" onClick={() => setStep("input")} role="presentation">
              <div
                className="cp-sheet"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
              >
                <div className="cp-sheet-paw" aria-hidden />
                {step === "confirm" ? (
                  <>
                    <div className="cp-sheet-title">
                      {accountName}
                      <br />
                      <span className="cp-sheet-strong">{amountText}원</span> 가져올까요?
                    </div>
                    <div className="cp-sheet-sub">입금 {accountNo}</div>

                    <button className="cp-sheet-btn" type="button" onClick={() => setStep("done")}>
                      충전하기
                    </button>
                  </>
                ) : (
                  <>
                    <div className="cp-sheet-title">충전이 완료되었습니다!</div>
                    <div className="cp-sheet-sub">입금 {accountNo}</div>

                    <button
                      className="cp-sheet-btn"
                      type="button"
                      onClick={() => {
                        setStep("input");
                        setDigits("");
                        nav("/mypage");
                      }}
                    >
                      완료
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PhoneFrame>
  );
}
