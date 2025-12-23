type Props = {
  onNumber: (v: string) => void;
  onBack: () => void;
};

const KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["00", "0", "←"],
];

export default function Keypad({ onNumber, onBack }: Props) {
  return (
    <section className="cp-keypad">
      {KEYS.map((row, i) => (
        <div className="cp-key-row" key={i}>
          {row.map((k) =>
            k === "←" ? (
              <button
                key={k}
                className="cp-key cp-key-back"
                onClick={onBack}
                type="button"
              >
                ←
              </button>
            ) : (
              <button
                key={k}
                className="cp-key"
                onClick={() => onNumber(k)}
                type="button"
              >
                {k}
              </button>
            )
          )}
        </div>
      ))}
    </section>
  );
}
