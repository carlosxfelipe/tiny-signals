import { h } from "@tiny/tiny-signals.ts";
import { createSignal, createMemo, batch } from "@tiny/tiny-signals.ts";
import { StyleSheet } from "@styles/stylesheet.ts";
import Button from "@components/Button.tsx";

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
        <Button onClick={dec} disabled={() => count() <= 0}>
          −1
        </Button>
        <Button variant="solid" tone="primary" onClick={inc}>
          +1
        </Button>
        <Button variant="solid" tone="primary" onClick={plusTwo}>
          +2 (batch)
        </Button>
        <Button
          variant="solid"
          tone="danger"
          onClick={reset}
          disabled={isAtReset}
        >
          reset
        </Button>
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
});
