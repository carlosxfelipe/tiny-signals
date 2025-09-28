import { h, createMemo, batch } from "@tiny/tiny-signals.ts";
import { StyleSheet } from "@styles/stylesheet.ts";
import Button from "@components/Button.tsx";
import { counterStore } from "@store/counter.ts";

type Props = { initial?: number; resetTo?: number };

export default function CounterPage({ initial = 0, resetTo = 0 }: Props) {
  if (initial !== 0 && counterStore.getState().count === 0) {
    counterStore.setState({ count: initial });
  }

  const count = counterStore.select((s) => s.count);
  const doubled = createMemo(() => count() * 2);
  const { inc, dec, reset } = counterStore.getState();

  const plusTwo = () =>
    batch(() => {
      inc();
      inc();
    });

  const isAtReset = createMemo(() => count() === resetTo);

  return (
    <div className="screen">
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
          onClick={() => reset(resetTo)}
          disabled={isAtReset}
        >
          reset
        </Button>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  title: { margin: "0 0 12px", color: "var(--primary)" },
  infoBox: { display: "grid", "row-gap": "4px", "margin-bottom": "16px" },
  bold: { "font-weight": 600 },
  muted: { color: "var(--muted)" },
  actions: { display: "flex", gap: "8px", "flex-wrap": "wrap" },
});
