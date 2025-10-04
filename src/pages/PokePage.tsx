import { h, createSignal, createEffect, onCleanup, For } from "@tiny/index.ts";
import { StyleSheet } from "@styles/stylesheet.ts";
import { http } from "@lib/http.ts";
import { getSearch, navigate } from "@src/router/router.ts";
import Button from "@components/Button.tsx";
import Icon from "@icons/Icon.tsx";

type ApiResult = {
  results: Array<{ name: string; url: string }>;
};

type Pokemon = {
  id: number;
  name: string;
  img: string;
};

const PAGE_SIZE = 25;
const MAX_ITEMS = 150;
const TOTAL_PAGES = Math.ceil(MAX_ITEMS / PAGE_SIZE);

function idFromUrl(url: string): number {
  const m = url.match(/\/pokemon\/(\d+)\/?$/);
  return m ? Number(m[1]) : 0;
}

function artUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export default function PokePage() {
  const initialPage = Math.max(0, (Number(getSearch().get("page")) || 1) - 1);

  const [page, setPage] = createSignal(initialPage);
  const [list, setList] = createSignal<Pokemon[]>([]);
  const [error, setError] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(false);

  const cache: Record<number, Pokemon[]> = {};

  async function fetchPage(pageIndex: number, signal: AbortSignal) {
    const start = pageIndex * PAGE_SIZE;
    const remaining = Math.max(0, MAX_ITEMS - start);
    const limit = Math.min(PAGE_SIZE, remaining);
    if (limit <= 0) {
      setList([]);
      return;
    }
    if (cache[pageIndex]) {
      setList(cache[pageIndex]);
      return;
    }
    const { data } = await http.get<ApiResult>(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${start}`,
      { signal }
    );
    const mapped: Pokemon[] = data.results.map((p) => {
      const id = idFromUrl(p.url);
      return { id, name: p.name, img: artUrl(id) };
    });
    cache[pageIndex] = mapped;
    setList(mapped);
  }

  createEffect(() => {
    const current = page();
    const controller = new AbortController();
    const { signal } = controller;
    setError(null);
    const hasCache = !!cache[current];
    if (!hasCache) setLoading(true);
    (async () => {
      try {
        await fetchPage(current, signal);
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          setError("Falha ao carregar Pokémons.");
        }
      } finally {
        setLoading(false);
      }
    })();
    onCleanup(() => controller.abort());
  });

  createEffect(() => {
    const onHash = () => {
      const s = getSearch();
      const p = Math.max(0, (Number(s.get("page")) || 1) - 1);
      setPage(p);
    };
    globalThis.addEventListener("hashchange", onHash);
    onCleanup(() => globalThis.removeEventListener("hashchange", onHash));
  });

  const goPrev = () => {
    if (page() > 0 && !loading()) {
      const next = page() - 1;
      navigate("#/pokedex", { page: next + 1 });
    }
  };

  const goNext = () => {
    if (page() < TOTAL_PAGES - 1 && !loading()) {
      const next = page() + 1;
      navigate("#/pokedex", { page: next + 1 });
    }
  };

  const canPrev = () => page() > 0 && !loading();
  const canNext = () => page() < TOTAL_PAGES - 1 && !loading();

  return (
    <section>
      <header style={styles.header}>
        <h1 style={styles.title}>Pokédex</h1>
        <p style={styles.subtitle}>
          Dados da{" "}
          <a
            class="link"
            href="https://pokeapi.co/"
            target="_blank"
            rel="noreferrer"
          >
            PokeAPI
          </a>
        </p>
      </header>

      <div style={styles.pager}>
        <Button onClick={goPrev} disabled={() => !canPrev()}>
          <Icon name="chevron-left" size={24} ariaLabel="Página anterior" />
        </Button>

        <span style={styles["pager-label"]}>
          {() => `Página ${page() + 1} / ${TOTAL_PAGES}`}
        </span>

        <Button onClick={goNext} disabled={() => !canNext()}>
          <Icon name="chevron-right" size={24} ariaLabel="Próxima página" />
        </Button>
      </div>

      {() =>
        error() ? (
          <div style={styles.error}>{error()}</div>
        ) : list().length === 0 && loading() ? (
          <GridSkeleton />
        ) : (
          <div style={styles.grid}>
            <For each={() => list()} key={(item) => item.id}>
              {(item) => (
                <div style={styles.card}>
                  <div style={styles["card-btn"] as JSX.StyleObject}>
                    <div style={styles["thumb-wrap"]}>
                      <img
                        src={item.img}
                        alt=""
                        width={160}
                        height={160}
                        style={{
                          ...styles.thumb,
                          "view-transition-name": `poke-${item.id}`,
                        }}
                        loading="lazy"
                      />
                    </div>
                    <span style={styles.name}>{capitalize(item.name)}</span>
                  </div>
                </div>
              )}
            </For>
          </div>
        )
      }

      {() =>
        loading() && list().length > 0 ? (
          <div style={{ "text-align": "center", padding: "12px" }}>
            Carregando…
          </div>
        ) : null
      }
    </section>
  );
}

function GridSkeleton() {
  return (
    <div style={styles.grid} aria-hidden="true">
      {Array.from({ length: 12 }).map((_, _i) => (
        <div style={styles.card}>
          <div style={styles["card-btn"] as JSX.StyleObject}>
            <div style={styles["skel-img"]} />
            <div style={styles["skel-text"]} />
          </div>
        </div>
      ))}
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
  error: {
    border: "1px solid var(--danger)",
    background: "color-mix(in srgb, var(--danger) 12%, var(--card-bg))",
    color: "var(--fg)",
    padding: "12px",
    "border-radius": "12px",
    margin: "12px 0",
    "font-weight": 600,
  },
  header: { "margin-bottom": "16px" },
  title: {
    margin: "0 0 12px",
  },
  subtitle: { margin: "0", color: "var(--muted)", "font-size": "14px" },
  pager: {
    display: "flex",
    "align-items": "center",
    gap: "12px",
    "margin-bottom": "12px",
  },
  "pager-label": {
    flex: "1 1 auto",
    "text-align": "center",
    "font-weight": 700,
  },
  grid: {
    display: "grid",
    "grid-template-columns": "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "16px",
    "list-style": "none",
    padding: "0",
    margin: "0",
  },
  card: {
    border: "1px solid var(--card-border)",
    background: "var(--card-bg)",
    "border-radius": "14px",
    "box-shadow": "var(--shadow)",
    overflow: "hidden",
  },
  "card-btn": {
    display: "grid",
    "grid-template-rows": "auto 1fr",
    width: "100%",
    "text-align": "center",
    background: "transparent",
    border: "0",
    padding: "12px",
    color: "var(--fg)",
  },
  "thumb-wrap": {
    display: "grid",
    "place-items": "center",
    "aspect-ratio": "1 / 1",
  },
  thumb: {
    width: "min(160px, 60vw)",
    height: "auto",
    filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.15))",
  },
  name: {
    "font-weight": 700,
    "margin-top": "8px",
    "text-transform": "capitalize",
    color: "var(--fg)",
  },
  "skel-img": {
    width: "100%",
    "aspect-ratio": "1 / 1",
    background: "linear-gradient(90deg, #0000 0%, #0001 50%, #0000 100%)",
    "background-color": "#0000000a",
    "background-size": "200% 100%",
    animation: "skel 1.2s infinite linear",
    "border-radius": "12px",
  },
  "skel-text": {
    height: "14px",
    "margin-top": "10px",
    background: "#00000010",
    "border-radius": "6px",
  },
});
