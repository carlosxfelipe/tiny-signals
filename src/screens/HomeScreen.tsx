import { h } from "@tiny/tiny-signals.ts";
import { StyleSheet } from "@styles/stylesheet.ts";
import Button from "@components/Button.tsx";
import { navigate } from "@src/router/router.ts";
import type { Route } from "@src/router/router.ts";

export default function HomeScreen() {
  return (
    <section style={styles.card}>
      <h1 style={styles.title}>Olá, mundo! 👋</h1>
      <p style={styles.p}>Esta é a tela inicial.</p>
      <Button
        variant="solid"
        tone="primary"
        onClick={() => navigate("#/counter" as Route)}
      >
        Ir para o Contador
      </Button>
    </section>
  );
}

const styles = StyleSheet.create({
  card: {
    "max-width": "620px",
    margin: "24px auto 0",
    padding: "24px",
    "border-radius": "20px",
    border: "1px solid var(--card-border)",
    "box-shadow": "var(--shadow)",
    background: "var(--card-bg)",
  },
  title: {
    margin: "0 0 12px",
    color: "var(--primary)",
  },
  p: {
    margin: "0 0 16px",
    color: "var(--muted)",
  },
});
