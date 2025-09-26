import { h } from "@tiny/tiny-signals.ts";
import { createSignal, createMemo, batch } from "@tiny/tiny-signals.ts";

type Props = {
  initial?: number;
  resetTo?: number;
};

export default function CounterScreen({ initial = 0, resetTo = 0 }: Props) {
  const [count, setCount] = createSignal(initial);
  const doubled = createMemo(() => count() * 2);

  const inc = () => setCount((c) => c + 1);
  const dec = () => setCount((c) => c - 1);
  const reset = () => setCount(resetTo);
  const plusTwo = () =>
    batch(() => {
      inc();
      inc();
    });

  const isAtReset = createMemo(() => count() === resetTo);

  return (
    <div
      className="screen"
      style={{
        maxWidth: "520px",
        margin: "40px auto",
        padding: "24px",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 16px rgba(0,0,0,.06)",
        background: "#fff",
        lineHeight: 1.5,
      }}
    >
      <h1 style={{ margin: "0 0 12px", color: "#4f46e5" }}>Counter</h1>

      <div style={{ display: "grid", rowGap: "4px", marginBottom: "16px" }}>
        <div>
          Valor: <span style={{ fontWeight: 600 }}>{count}</span>
        </div>
        <div style={{ color: "#6b7280" }}>
          Dobro (memo): <span style={{ fontWeight: 600 }}>{doubled}</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={dec}
          disabled={() => count() <= 0}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            background: "#fff",
            cursor: () => (count() <= 0 ? "not-allowed" : "pointer"),
            opacity: () => (count() <= 0 ? 0.5 : 1),
          }}
        >
          −1
        </button>

        <button
          type="button"
          onClick={inc}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
            cursor: "pointer",
          }}
        >
          +1
        </button>

        <button
          type="button"
          onClick={plusTwo}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
            cursor: "pointer",
          }}
        >
          +2 (batch)
        </button>

        <button
          type="button"
          onClick={reset}
          disabled={isAtReset}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            background: "#fff",
            cursor: () => (isAtReset() ? "not-allowed" : "pointer"),
            opacity: () => (isAtReset() ? 0.5 : 1),
          }}
        >
          reset
        </button>
      </div>
    </div>
  );
}
