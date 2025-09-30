import { createStore } from "@src/store/createStore.ts";

export type CepItem = {
  id: string; // `${cep}-${ts}`
  ts: number; // timestamp
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  ddd: string;
};

type CepState = {
  items: CepItem[];
  add(item: Omit<CepItem, "id" | "ts">): void;
  remove(id: string): void;
  clear(): void;
};

export const cepStore = createStore<CepState>(
  (set, _get) => ({
    items: [],
    add: (raw) =>
      set((s) => {
        const ts = Date.now();
        const id = `${raw.cep}-${ts}`;
        // evita duplicatas por CEP: mantém o mais recente no topo
        const filtered = s.items.filter((i) => i.cep !== raw.cep);
        return { items: [{ id, ts, ...raw }, ...filtered] };
      }),
    remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
    clear: () => set({ items: [] }),
  }),
  {
    name: "app.cep.history.v1",
    persist: true,
    version: 1,
  }
);
