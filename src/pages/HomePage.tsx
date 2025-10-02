import { h, createSignal, Show, For } from "@tiny/index.ts";
import { StyleSheet } from "@styles/stylesheet.ts";
import Button from "@components/Button.tsx";
import Icon from "@icons/Icon.tsx";

export default function HomePage() {
  const [show, setShow] = createSignal(false);
  const [items, setItems] = createSignal([
    { id: 1, emoji: "🌱", createdAt: new Date().toISOString() },
    { id: 2, emoji: "⚡", createdAt: new Date().toISOString() },
    { id: 3, emoji: "🚀", createdAt: new Date().toISOString() },
  ]);

  const addItem = () => {
    const now = new Date();
    const newItem = {
      id: Date.now(),
      emoji: "✨",
      createdAt: now.toISOString(),
    };
    setItems((prev) => [...prev, newItem]);
  };

  return (
    <section>
      <h1 style={styles.title}>Bem-vindo</h1>
      <p style={styles.p}>
        Um dia acordei pensando: “Sabe do que o mundo precisa? De mais um
        framework web em JavaScript!”
      </p>
      <p style={styles.p}>
        Brincadeiras à parte, provavelmente não precisamos de mais um… mas eu
        quis fazer mesmo assim — e está sendo muito divertido. Acabei criando
        não apenas um, mas dois:{" "}
        <a
          href="https://github.com/carlosxfelipe/tiny-vdom"
          target="_blank"
          rel="noopener noreferrer"
          class="link"
        >
          Tiny-vdom
        </a>{" "}
        e{" "}
        <a
          href="https://github.com/carlosxfelipe/tiny-signals"
          target="_blank"
          rel="noopener noreferrer"
          class="link"
        >
          Tiny-signals
        </a>
        .
      </p>
      <p style={styles.p}>
        O Tiny-vdom é uma mini-lib React/Preact-like, com Virtual DOM, hooks e
        suporte a JSX, perfeita para aprender ou experimentar os conceitos
        fundamentais de bibliotecas como React.
      </p>
      <p style={styles.p}>
        Já o Tiny-signals aposta em reatividade fina, inspirado em ideias do
        SolidJS, usando signals para atualizações diretas na árvore do DOM.
        Ambos são pequenos, rodam sobre Deno e têm código simples, ideal para
        estudar e prototipar.
      </p>
      <p style={styles.p}>
        A ideia não é competir com frameworks consolidados, mas explorar,
        aprender e me divertir criando — e, quem sabe, inspirar outras pessoas a
        experimentar o mesmo.
      </p>

      <div style={styles.demoBox}>
        <h2 style={styles.h2}>Exemplos</h2>

        <div style={styles.card}>
          <div style={styles.row}>
            <strong>Show:</strong>
            <Button onClick={() => setShow((v) => !v)} size="sm">
              Alternar
            </Button>
          </div>
          <Show when={show}>
            <div style={styles.showBox}>Agora você me vê 👋</div>
          </Show>
        </div>

        <div style={styles.card}>
          <div style={styles.row}>
            <strong>For:</strong>
            <Button onClick={addItem} size="sm" title="Adicionar item">
              <Icon name="plus" size={16} />
            </Button>
          </div>
          <ul style={styles.list}>
            <For each={() => items()} key={(item) => item.id}>
              {(item, i) => (
                <li style={styles.listItem}>
                  <span style={styles.badge}>{() => i() + 1}</span>{" "}
                  {() => item.emoji}{" "}
                  <span style={styles.date}>
                    {() =>
                      new Date(item.createdAt).toLocaleTimeString() +
                      "." +
                      new Date(item.createdAt)
                        .getMilliseconds()
                        .toString()
                        .padStart(3, "0")
                    }
                  </span>
                </li>
              )}
            </For>
          </ul>
        </div>
      </div>
    </section>
  );
}

const styles = StyleSheet.create({
  title: {
    margin: "0 0 12px",
    color: "var(--primary)",
  },
  p: {
    margin: "0 0 16px",
    color: "var(--muted)",
  },
  h2: {
    margin: "16px 0 8px",
    color: "var(--fg)",
    "font-size": "18px",
  },
  demoBox: {
    margin: "16px 0 0",
    display: "grid",
    gap: "12px",
  },
  card: {
    padding: "12px",
    border: "1px solid var(--card-border)",
    "border-radius": "8px",
    background: "var(--card-bg)",
  },
  row: {
    display: "flex",
    "align-items": "center",
    "justify-content": "space-between",
    "margin-bottom": "8px",
    gap: "8px",
  },
  showBox: {
    padding: "8px 10px",
    background: "var(--btn-bg)",
    border: "1px solid var(--btn-border)",
    "border-radius": "8px",
  },
  list: {
    margin: 0,
    padding: 0,
    "list-style": "none",
    display: "grid",
    gap: "6px",
  },
  listItem: {
    display: "flex",
    "align-items": "center",
    gap: "8px",
  },
  badge: {
    display: "inline-flex",
    "align-items": "center",
    "justify-content": "center",
    width: "22px",
    height: "22px",
    "border-radius": "9999px",
    background: "var(--btn-bg)",
    border: "1px solid var(--btn-border)",
    "font-size": "12px",
    "font-weight": 600,
  },
  date: {
    "font-size": "12px",
    color: "var(--muted)",
  },
});
