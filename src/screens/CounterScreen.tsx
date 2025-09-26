import { h } from "@tiny/tiny-signals.ts";
import { createSignal, createMemo, batch } from "@tiny/tiny-signals.ts";
import { StyleSheet } from "@styles/stylesheet.ts";

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
    <div className="screen" style={styles.card}>
      <h1 style={styles.title}>Counter</h1>

      <div style={styles.infoBox}>
        <div>
          Valor: <span style={styles.bold}>{count}</span>
        </div>
        <div style={styles.muted}>
          Dobro (memo): <span style={styles.bold}>{doubled}</span>
        </div>
      </div>

      <div style={styles.actions}>
        <button
          type="button"
          onClick={dec}
          disabled={() => count() <= 0}
          style={StyleSheet.merge(styles.btn, {
            cursor: () => (count() <= 0 ? "not-allowed" : "pointer"),
            opacity: () => (count() <= 0 ? 0.5 : 1),
          })}
        >
          −1
        </button>

        <button type="button" onClick={inc} style={styles.btnAlt}>
          +1
        </button>

        <button type="button" onClick={plusTwo} style={styles.btnAlt}>
          +2 (batch)
        </button>

        <button
          type="button"
          onClick={reset}
          disabled={isAtReset}
          style={StyleSheet.merge(styles.btn, {
            cursor: () => (isAtReset() ? "not-allowed" : "pointer"),
            opacity: () => (isAtReset() ? 0.5 : 1),
          })}
        >
          reset
        </button>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  card: {
    maxWidth: "520px",
    margin: "24px auto 0",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid var(--card-border)",
    boxShadow: "var(--shadow)",
    background: "var(--card-bg)",
    lineHeight: 1.5,
  },
  title: {
    margin: "0 0 12px",
    color: "var(--primary)",
  },
  infoBox: {
    display: "grid",
    rowGap: "4px",
    marginBottom: "16px",
  },
  bold: {
    fontWeight: 600,
  },
  muted: {
    color: "var(--muted)",
  },
  actions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  btn: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid var(--btn-border)",
    background: "var(--card-bg)",
  },
  btnAlt: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid var(--btn-border)",
    background: "var(--btn-bg)",
    cursor: "pointer",
  },
});
