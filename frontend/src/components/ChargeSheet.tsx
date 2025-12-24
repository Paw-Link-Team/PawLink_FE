type Props = {
  step: "confirm" | "done";
  amountText: string;
  accountName: string;
  accountNo: string;
  onConfirm: () => void;
  onDone: () => void;
  onClose: () => void;
};

export default function ChargeSheet({
  step,
  amountText,
  accountName,
  accountNo,
  onConfirm,
  onDone,
  onClose,
}: Props) {
  return (
    <div className="cp-dim" onClick={onClose}>
      <div className="cp-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="cp-sheet-paw" />
        {step === "confirm" ? (
          <>
            <div className="cp-sheet-title">
              {accountName}
              <br />
              <span className="cp-sheet-strong">{amountText}원</span> 가져올까요?
            </div>
            <div className="cp-sheet-sub">입금 {accountNo}</div>
            <button className="cp-sheet-btn" onClick={onConfirm}>
              충전하기
            </button>
          </>
        ) : (
          <>
            <div className="cp-sheet-title">충전이 완료되었습니다!</div>
            <div className="cp-sheet-sub">입금 {accountNo}</div>
            <button className="cp-sheet-btn" onClick={onDone}>
              완료
            </button>
          </>
        )}
      </div>
    </div>
  );
}
