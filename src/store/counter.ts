import { createStore } from "@src/store/createStore.ts";

type CounterState = {
  count: number;
  inc(): void;
  dec(): void;
  reset(to?: number): void;
};

export const counterStore = createStore<CounterState>(
  (set, _get) => ({
    count: 0,
    inc: () => set((s) => ({ count: s.count + 1 })),
    dec: () => set((s) => ({ count: Math.max(0, s.count - 1) })),
    reset: (to = 0) => set({ count: to }),
  }),
  {
    name: "app.counter.v1",
    persist: true,
    version: 1,
  }
);
