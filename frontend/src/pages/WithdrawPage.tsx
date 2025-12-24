import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWalletPoint } from "../api/wallet";
import { useMyPage } from "../hooks/useMyPage";
import "./WithdrawPage.css";

export default function WithdrawPage() {
  const navigate = useNavigate();
  const { balance, refreshBalance } = useMyPage();
  const [amount, setAmount] = useState("");

  const handleWithdraw = async () => {
    const value = Number(amount);
    if (!value || value <= 0) {
      alert("출금 금액을 입력하세요");
      return;
    }

    if (value > balance) {
      alert("잔액이 부족합니다");
      return;
    }

    try {
      await useWalletPoint({
        amount: value,
        reason: "WITHDRAW",
      });

      await refreshBalance();
      alert("출금 완료");
      navigate("/mypage");
    } catch {
      alert("출금 실패");
    }
  };

  return (
    <div className="pay-screen">
      <h1>출금</h1>

      <div>현재 잔액: {balance.toLocaleString()}원</div>

      <input
        type="number"
        placeholder="출금 금액"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={handleWithdraw}>출금하기</button>
    </div>
  );
}
