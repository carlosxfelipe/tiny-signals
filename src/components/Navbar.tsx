import { h } from "@tiny/tiny-signals.ts";
import { StyleSheet } from "@styles/stylesheet.ts";
import Icon from "@icons/Icon.tsx";

interface NavbarProps {
  currentPath?: string;
}

export default function Navbar({ currentPath }: NavbarProps = {}) {
  const path =
    currentPath ??
    (typeof location !== "undefined" ? location.hash || "#/" : "#/");
  const links = [
    { href: "#/", label: "Início", icon: "home-outline" as const },
    { href: "#/counter", label: "Contador", icon: "plus" as const },
  ];
  const isActive = (href: string) =>
    href === "#/" ? path === "#/" : path.startsWith(href);

  return (
    <header style={styles.navbar} role="navigation" aria-label="Principal">
      <div style={styles.inner}>
        <a href="#/" style={styles.brand} aria-label="Página inicial">
          <span style={styles.brandText}>Tiny Signals</span>
        </a>
        <nav style={styles.links}>
          {links.map(({ href, label, icon }) => (
            <a
              href={href}
              style={{
                ...styles.link,
                ...(isActive(href) ? styles.linkActive : {}),
              }}
              aria-current={isActive(href) ? "page" : undefined}
              aria-label={label}
            >
              <span style={styles.iconWrap}>
                <Icon name={icon} size={18} ariaLabel={label} />
              </span>
              <span style={styles.linkLabel}>{label}</span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

const styles = StyleSheet.create({
  navbar: {
    padding: "10px 16px",
    "border-bottom": "1px solid var(--card-border)",
    "margin-bottom": "24px",
    background: "var(--btn-bg)",
    color: "var(--fg)",
  },
  inner: {
    display: "flex",
    "align-items": "center",
    "justify-content": "space-between",
    width: "min(100%, 1024px)",
    margin: "0 auto",
    gap: "16px",
  },
  brand: {
    display: "inline-flex",
    "align-items": "center",
    gap: "10px",
    "text-decoration": "none",
    color: "inherit",
    "user-select": "none",
    "font-weight": 700,
    "letter-spacing": "-0.01em",
  },
  brandText: {
    "font-size": "15px",
  },
  links: {
    display: "flex",
    gap: "6px",
    "align-items": "center",
  },
  link: {
    display: "inline-flex",
    "align-items": "center",
    gap: "8px",
    padding: "8px 10px",
    "border-radius": "10px",
    "text-decoration": "none",
    color: "inherit",
    "font-weight": 500,
    "line-height": 1,
    transition:
      "background 120ms ease, color 120ms ease, box-shadow 120ms ease",
    "outline-offset": "2px",
    outline: "none",
    "user-select": "none",
  },
  linkActive: {
    background: "var(--btn-active)",
    "box-shadow": "var(--ring)",
  },
  iconWrap: {
    display: "inline-flex",
    "align-items": "center",
    "justify-content": "center",
    width: "18px",
    height: "18px",
  },
  linkLabel: {
    "font-size": "14px",
  },
});
