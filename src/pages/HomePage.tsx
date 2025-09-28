import { h } from "@tiny/tiny-signals.ts";
import { StyleSheet } from "@styles/stylesheet.ts";
import Button from "@components/Button.tsx";
import { navigate } from "@src/router/router.ts";
import type { Route } from "@src/router/router.ts";

export default function HomePage() {
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
  title: {
    margin: "0 0 12px",
    color: "var(--primary)",
  },
  p: {
    margin: "0 0 16px",
    color: "var(--muted)",
  },
});
