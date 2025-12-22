import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneFrame from "../components/PhoneFrame";
import "./WithdrawPage.css";

type Step = "input" | "confirm" | "done";

export default function Withdrawpage() {
  const nav = useNavigate();

  // ✅ 출금 문구만 변경
  const accountName = "내 입금받을 계좌로";
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
    <PhoneFrame className="wd-frame">
      <div className="wd-root">
        <div className="wd-phone">
          {/* Top bar */}
          <header className="wd-top">
            <button className="wd-x" type="button" onClick={resetAndGoBack} aria-label="close">
              ✕
            </button>
            <div className="wd-title">출금</div>
            <div className="wd-top-right" />
          </header>

          {/* Content */}
          <main className="wd-main">
            <div className="wd-bank">
              <div className="wd-paw" aria-hidden />
              <div className="wd-bank-text">
                <div className="wd-bank-name">{accountName}</div>
                <div className="wd-bank-no">{accountNo}</div>
              </div>
            </div>

            {/* Amount */}
            {!digits ? (
              <>
                <div className="wd-ask">얼마를 출금 할까요?</div>
                <div className="wd-sub">현재 잔액 0원</div>
              </>
            ) : (
              <>
                <div className="wd-amount">
                  <span className="wd-amount-num">{amountText}</span>
                  <span className="wd-amount-won">원</span>
                </div>
                <div className="wd-sub">현재 잔액 0원</div>
              </>
            )}

            {/* Keypad */}
            <section className="wd-keypad" aria-label="keypad">
              <div className="wd-key-row">
                <button className="wd-key" onClick={() => addDigits("1")} type="button">
                  1
                </button>
                <button className="wd-key" onClick={() => addDigits("2")} type="button">
                  2
                </button>
                <button className="wd-key" onClick={() => addDigits("3")} type="button">
                  3
                </button>
              </div>
              <div className="wd-key-row">
                <button className="wd-key" onClick={() => addDigits("4")} type="button">
                  4
                </button>
                <button className="wd-key" onClick={() => addDigits("5")} type="button">
                  5
                </button>
                <button className="wd-key" onClick={() => addDigits("6")} type="button">
                  6
                </button>
              </div>
              <div className="wd-key-row">
                <button className="wd-key" onClick={() => addDigits("7")} type="button">
                  7
                </button>
                <button className="wd-key" onClick={() => addDigits("8")} type="button">
                  8
                </button>
                <button className="wd-key" onClick={() => addDigits("9")} type="button">
                  9
                </button>
              </div>
              <div className="wd-key-row">
                <button className="wd-key" onClick={() => addDigits("00")} type="button">
                  00
                </button>
                <button className="wd-key" onClick={() => addDigits("0")} type="button">
                  0
                </button>
                <button
                  className="wd-key wd-key-back"
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
          <footer className="wd-bottom">
            <button
              className={`wd-submit ${canSubmit ? "on" : ""}`}
              type="button"
              disabled={!canSubmit}
              onClick={() => setStep("confirm")}
            >
              출금하기
            </button>
          </footer>

          {/* Confirm / Done Bottom Sheet */}
          {(step === "confirm" || step === "done") && (
            <div className="wd-dim" onClick={() => setStep("input")} role="presentation">
              <div
                className="wd-sheet"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
              >
                <div className="wd-sheet-paw" aria-hidden />
                {step === "confirm" ? (
                  <>
                    <div className="wd-sheet-title">
                      {accountName}
                      <br />
                      <span className="wd-sheet-strong">{amountText}원</span> 보낼까요?
                    </div>
                    <div className="wd-sheet-sub">출금 {accountNo}</div>

                    <button className="wd-sheet-btn" type="button" onClick={() => setStep("done")}>
                      보내기
                    </button>
                  </>
                ) : (
                  <>
                    <div className="wd-sheet-title">출금이 완료되었습니다!</div>
                    <div className="wd-sheet-sub">출금 {accountNo}</div>

                    <button
                      className="wd-sheet-btn"
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
