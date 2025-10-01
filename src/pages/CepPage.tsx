import { h, createSignal } from "@tiny/tiny-signals.ts";
import { StyleSheet } from "@styles/stylesheet.ts";
import Button from "@components/Button.tsx";
import { http } from "@lib/http.ts";
import Icon from "@icons/Icon.tsx";
import { cepStore } from "@store/cep.ts";

type ViaCepResponse = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ddd: string;
  erro?: boolean;
};

export default function CepPage() {
  const [cep, setCep] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [addr, setAddr] = createSignal<ViaCepResponse | null>(null);
  const history = cepStore.select((s) => s.items);

  function onlyDigits(s: string) {
    return s.replace(/\D/g, "");
  }

  function maskCep(raw: string) {
    const d = onlyDigits(raw).slice(0, 8);
    return d.length <= 5 ? d : `${d.slice(0, 5)}-${d.slice(5)}`;
  }

  async function fetchCep() {
    const digits = onlyDigits(cep());
    if (digits.length !== 8) {
      setError("CEP deve ter 8 dígitos.");
      setAddr(null);
      return;
    }
    setLoading(true);
    setError(null);
    setAddr(null);
    try {
      const res = await http.get<ViaCepResponse>(
        `https://viacep.com.br/ws/${digits}/json/`
      );
      if (res.data.erro) throw new Error("CEP não encontrado.");
      setAddr(res.data);
      cepStore.getState().add({
        cep: res.data.cep,
        logradouro: res.data.logradouro || "—",
        bairro: res.data.bairro || "—",
        localidade: res.data.localidade,
        uf: res.data.uf,
        ddd: res.data.ddd,
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function handleInput(ev: Event) {
    setCep(maskCep((ev.target as HTMLInputElement).value));
  }

  function clearFields() {
    setCep("");
    setError(null);
    setAddr(null);
    const el = document.getElementById("cep-input") as HTMLInputElement | null;
    if (el) el.value = "";
  }

  return (
    <section>
      <h1 style={styles.title}>Buscar CEP</h1>

      <div style={styles.form}>
        <input
          id="cep-input"
          type="text"
          placeholder="00000-000"
          value={cep}
          onInput={handleInput}
          style={styles.input}
        />
        <Button
          variant="solid"
          tone="primary"
          onClick={fetchCep}
          loading={loading}
        >
          Buscar
        </Button>
        <Button onClick={clearFields}>Limpar</Button>
      </div>

      {() => error() && <p style={styles.error}>{error()}</p>}
      {() =>
        addr() && (
          <div style={styles.result}>
            <div>
              <strong>CEP:</strong> {addr()!.cep}
            </div>
            <div>
              <strong>Logradouro:</strong> {addr()!.logradouro || "—"}
            </div>
            <div>
              <strong>Bairro:</strong> {addr()!.bairro || "—"}
            </div>
            <div>
              <strong>Cidade/UF:</strong> {addr()!.localidade}/{addr()!.uf}
            </div>
            <div>
              <strong>DDD:</strong> {addr()!.ddd}
            </div>
          </div>
        )
      }

      {() =>
        history().length > 0 && (
          <div style={styles.historyBox}>
            <div style={styles.historyHeader}>
              <h2 style={styles.h2}>Histórico</h2>
              <Button
                tone="danger"
                onClick={() => cepStore.getState().clear()}
                title="Limpar todo o histórico"
              >
                Limpar tudo
              </Button>
            </div>
            <ul style={styles.historyList}>
              {history().map((item) => (
                <li style={styles.historyItem}>
                  <div style={styles.historyText}>
                    <div>
                      <strong>CEP:</strong> {item.cep}
                    </div>
                    <div style={styles.muted}>
                      {item.logradouro !== "—" ? `${item.logradouro}, ` : ""}
                      {item.bairro !== "—" ? `${item.bairro}, ` : ""}
                      {item.localidade}/{item.uf} • DDD {item.ddd}
                    </div>
                  </div>
                  <button
                    type="button"
                    title="Excluir do histórico"
                    onClick={() => cepStore.getState().remove(item.id)}
                    style={styles.iconButton}
                    aria-label={`Excluir ${item.cep} do histórico`}
                  >
                    <Icon
                      name="trash-can-outline"
                      size={20}
                      ariaLabel="Excluir"
                      color="var(--fg)"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )
      }
    </section>
  );
}

const styles = StyleSheet.create({
  title: { margin: "0 0 12px", color: "var(--primary)" },
  form: {
    display: "flex",
    gap: "8px",
    "margin-bottom": "12px",
    "flex-wrap": "wrap",
    "align-items": "stretch",
  },
  input: {
    padding: "8px 12px",
    "border-radius": "8px",
    border: "1px solid var(--card-border)",
    "font-size": "14px",
    flex: "1 1 280px",
    "min-width": "0",
  },
  error: { color: "var(--danger)", margin: "8px 0" },
  result: {
    padding: "12px",
    border: "1px solid var(--card-border)",
    "border-radius": "8px",
    background: "var(--card-bg)",
    "margin-top": "12px",
  },
  h2: { margin: "8px 0", color: "var(--fg)", "font-size": "18px" },
  historyBox: {
    margin: "16px 0 0",
    padding: "12px",
    border: "1px solid var(--card-border)",
    "border-radius": "8px",
    background: "var(--card-bg)",
  },
  historyHeader: {
    display: "flex",
    "align-items": "center",
    "justify-content": "space-between",
    "margin-bottom": "8px",
  },
  historyList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "grid",
    gap: "8px",
  },
  historyItem: {
    display: "flex",
    "align-items": "center",
    gap: "12px",
    padding: "8px 10px",
    border: "1px solid var(--card-border)",
    "border-radius": "8px",
    background: "var(--bg)",
  },
  historyText: {
    display: "grid",
    "row-gap": "2px",
    "flex-grow": "1",
  },
  muted: { color: "var(--muted)", "font-size": "13px" },
  iconButton: {
    marginLeft: "auto",
    display: "inline-flex",
    "align-items": "center",
    "justify-content": "center",
    width: "32px",
    height: "32px",
    border: "1px solid var(--card-border)",
    "border-radius": "8px",
    background: "var(--btn-bg)",
    cursor: "pointer",
  },
});
