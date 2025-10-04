import { h } from "@tiny/index.ts";
import Icon from "@icons/Icon.tsx";
import { StyleSheet } from "@styles/stylesheet.ts";

export default function AboutPage() {
  return (
    <section>
      <div style={styles.header}>
        <h1 style={styles.title}>Sobre mim</h1>
        <p style={styles.subtitle}>
          Sou <strong>Carlos Felipe Araújo</strong>, desenvolvedor{" "}
          <em>Mobile e Front-end</em>.
        </p>
      </div>

      <h2 style={styles.h2}>Contato</h2>
      <ul style={styles.list}>
        <li style={styles.item}>
          <Icon name="email" size={20} aria-hidden="true" />
          <span>
            Email:{" "}
            <a href="mailto:carlosxfelipe@gmail.com" class="link">
              carlosxfelipe@gmail.com
            </a>
          </span>
        </li>

        <li style={styles.item}>
          <Icon name="github" size={20} aria-hidden="true" />
          <span>
            GitHub:{" "}
            <a
              href="https://github.com/carlosxfelipe"
              target="_blank"
              rel="noreferrer"
              class="link"
            >
              github.com/carlosxfelipe
            </a>
          </span>
        </li>

        <li style={styles.item}>
          <Icon name="linkedin" size={20} aria-hidden="true" />
          <span>
            LinkedIn:{" "}
            <a
              href="https://linkedin.com/in/carlosxfelipe"
              target="_blank"
              rel="noreferrer"
              class="link"
            >
              linkedin.com/in/carlosxfelipe
            </a>
          </span>
        </li>

        <li style={styles.item}>
          <Icon name="whatsapp" size={20} aria-hidden="true" />
          <span>
            WhatsApp:{" "}
            <a
              href="https://wa.me/5585999502195"
              target="_blank"
              rel="noreferrer"
              class="link"
            >
              (85) 99950-2195
            </a>
          </span>
        </li>

        <li style={styles.item}>
          <Icon name="map-marker-outline" size={20} aria-hidden="true" />
          <span>Fortaleza, Ceará, Brasil</span>
        </li>
      </ul>
    </section>
  );
}

const styles = StyleSheet.create({
  header: {
    "margin-bottom": "12px",
  },
  title: {
    margin: "0 0 4px",
  },
  subtitle: {
    margin: "0",
    color: "var(--muted)",
  },
  h2: {
    margin: "16px 0 8px",
    color: "var(--fg)",
    "font-size": "18px",
  },
  list: {
    "list-style": "none",
    padding: "0",
    margin: "0",
    display: "grid",
    gap: "8px",
  },
  item: {
    display: "flex",
    "align-items": "center",
    gap: "8px",
  },
});
