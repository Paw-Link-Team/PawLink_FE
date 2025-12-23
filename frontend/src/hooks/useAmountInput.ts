import { useMemo, useState } from "react";

export function useAmountInput(maxLength = 12) {
  const [digits, setDigits] = useState("");

  const amount = useMemo(() => Number(digits || "0"), [digits]);

  const formatted = useMemo(() => {
    if (!digits) return "";
    return amount.toLocaleString("ko-KR");
  }, [digits, amount]);

  const add = (v: string) => {
    const next = (digits + v).replace(/^0+(\d)/, "$1");
    if (next.length > maxLength) return;
    setDigits(next);
  };

  const remove = () => {
    setDigits((prev) => prev.slice(0, -1));
  };

  const reset = () => setDigits("");

  return {
    digits,
    amount,
    formatted,
    canSubmit: amount > 0,
    add,
    remove,
    reset,
  };
}
