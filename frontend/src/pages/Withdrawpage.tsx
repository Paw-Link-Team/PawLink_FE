import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Withdrawpage.css";

type Step = "input" | "confirm" | "done";

export default function Withdrawpage() {
  const nav = useNavigate();

  const bankName = "내 명명은행 계좌로";
  const accountNo = useMemo(() => "12345678987456", []);

  const [step, setStep] = useState<Step>("input");
  const [digits, setDigits] = useState<string>(""); // 숫자만 저장 (콤마 X)

  const amountNum = useMemo(() => Number(digits || "0"), [digits]);
  const amountText = useMemo(() => {
    if (!digits) return "";
    return amountNum.toLocaleString("ko-KR");
  }, [digits, amountNum]);

  const canNext = amountNum > 0;

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
    <div className="wp-root">
      <div className="wp-phone">
        {/* Top bar */}
        <header className="wp-top">
          <button className="wp-x" type="button" onClick={resetAndGoBack} aria-label="close">
            ✕
          </button>
          <div className="wp-title">출금</div>
          <div className="wp-top-right" />
        </header>

        {/* Content */}
        <main className="wp-main">
          <div className="wp-bank">
            <div className="wp-paw" aria-hidden />
            <div className="wp-bank-text">
              <div className="wp-bank-name">{bankName}</div>
              <div className="wp-bank-no">{accountNo}</div>
            </div>
          </div>

          {/* Amount */}
          {!digits ? (
            <>
              <div className="wp-ask">얼마를 출금 할까요?</div>
              <div className="wp-sub">현재 잔액 0원</div>
            </>
          ) : (
            <>
              <div className="wp-amount">
                <span className="wp-amount-num">{amountText}</span>
                <span className="wp-amount-won">원</span>
              </div>
              <div className="wp-sub">현재 잔액 0원</div>
            </>
          )}

          {/* Keypad */}
          <section className="wp-keypad" aria-label="keypad">
            <div className="wp-key-row">
              <button className="wp-key" onClick={() => addDigits("1")} type="button">
                1
              </button>
              <button className="wp-key" onClick={() => addDigits("2")} type="button">
                2
              </button>
              <button className="wp-key" onClick={() => addDigits("3")} type="button">
                3
              </button>
            </div>
            <div className="wp-key-row">
              <button className="wp-key" onClick={() => addDigits("4")} type="button">
                4
              </button>
              <button className="wp-key" onClick={() => addDigits("5")} type="button">
                5
              </button>
              <button className="wp-key" onClick={() => addDigits("6")} type="button">
                6
              </button>
            </div>
            <div className="wp-key-row">
              <button className="wp-key" onClick={() => addDigits("7")} type="button">
                7
              </button>
              <button className="wp-key" onClick={() => addDigits("8")} type="button">
                8
              </button>
              <button className="wp-key" onClick={() => addDigits("9")} type="button">
                9
              </button>
            </div>
            <div className="wp-key-row">
              <button className="wp-key" onClick={() => addDigits("00")} type="button">
                00
              </button>
              <button className="wp-key" onClick={() => addDigits("0")} type="button">
                0
              </button>
              <button className="wp-key wp-key-back" onClick={backspace} type="button" aria-label="backspace">
                ←
              </button>
            </div>
          </section>
        </main>

        {/* Bottom button (input 단계에서는 '다음') */}
        <footer className="wp-bottom">
          {step === "input" && (
            <button
              className={`wp-submit ${canNext ? "on" : ""}`}
              type="button"
              disabled={!canNext}
              onClick={() => setStep("confirm")}
            >
              다음
            </button>
          )}
          {/* confirm/done 단계는 바텀시트 버튼으로 진행 */}
          {step !== "input" && <div className="wp-bottom-gap" />}
        </footer>

        {/* Confirm / Done Bottom Sheet */}
        {(step === "confirm" || step === "done") && (
          <div className="wp-dim" onClick={() => setStep("input")} role="presentation">
            <div className="wp-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
              <div className="wp-sheet-paw" aria-hidden />

              {step === "confirm" ? (
                <>
                  <div className="wp-sheet-title">
                    {bankName}
                    <br />
                    <span className="wp-sheet-strong">{amountText}원</span> 보낼까요?
                  </div>
                  <div className="wp-sheet-sub">입금 {accountNo}</div>

                  <button className="wp-sheet-btn" type="button" onClick={() => setStep("done")}>
                    보내기
                  </button>
                </>
              ) : (
                <>
                  <div className="wp-sheet-title">출금이 완료되었습니다!</div>
                  <div className="wp-sheet-sub">입금 {accountNo}</div>

                  <button
                    className="wp-sheet-btn"
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
  );
}
