import { h, createSignal } from "@tiny/tiny-signals.ts";
import { StyleSheet } from "@styles/stylesheet.ts";
import Button from "@components/Button.tsx";
import { http } from "@lib/http.ts";

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
    </section>
  );
}

const styles = StyleSheet.create({
  title: { margin: "0 0 12px", color: "var(--primary)" },
  form: { display: "flex", gap: "8px", "margin-bottom": "12px" },
  input: {
    padding: "8px 12px",
    "border-radius": "8px",
    border: "1px solid var(--card-border)",
    "font-size": "14px",
  },
  error: { color: "var(--danger)", margin: "8px 0" },
  result: {
    padding: "12px",
    border: "1px solid var(--card-border)",
    "border-radius": "8px",
    background: "var(--card-bg)",
    "margin-top": "12px",
  },
});
