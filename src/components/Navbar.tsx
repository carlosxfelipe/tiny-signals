// src/components/Navbar.tsx
import { h } from "@tiny/tiny-signals.ts";
import { StyleSheet } from "@styles/stylesheet.ts";

export default function Navbar() {
  return (
    <header style={styles.navbar}>
      <div style={styles.wrap}>
        <div style={styles.brand}>Navbar</div>
        <nav style={styles.links}>
          <a class="link" href="#/">
            Início
          </a>
          <a class="link" href="#/counter">
            Contador
          </a>
        </nav>
      </div>
    </header>
  );
}

const styles = StyleSheet.create({
  navbar: {
    padding: "16px",
    "border-bottom": "1px solid var(--card-border)",
    "margin-bottom": "24px",
    background: "var(--btn-bg)",
    color: "var(--fg)",
  },
  wrap: {
    display: "flex",
    "align-items": "center",
    "justify-content": "space-between",
    width: "min(100%, 1024px)",
    margin: "0 auto",
  },
  brand: {
    "font-weight": 600,
  },
  links: {
    display: "flex",
    gap: "16px",
  },
});
