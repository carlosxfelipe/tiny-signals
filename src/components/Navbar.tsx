import { h } from "@tiny/tiny-signals.ts";
import { StyleSheet } from "@styles/stylesheet.ts";

export default function Navbar() {
  return <header style={styles.navbar}>Navbar</header>;
}

const styles = StyleSheet.create({
  navbar: {
    padding: "16px",
    "border-bottom": "1px solid var(--card-border)",
    "margin-bottom": "24px",
    background: "var(--btn-bg)",
    color: "var(--fg)",
  },
});
