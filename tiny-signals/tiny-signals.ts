type Cleanup = () => void;

type Signal<T> = {
  get(): T;
  set(v: T | ((p: T) => T)): void;
  subs: Set<Computation>;
  value: T;
};

type Computation = {
  fn: () => void;
  deps: Set<Signal<unknown>>;
  cleanups: Cleanup[];
  parent?: Computation | null;
};

let CURRENT: Computation | null = null;
let BATCH = 0;
const PENDING = new Set<Computation>();

function runComputation(c: Computation) {
  for (const d of c.deps) d.subs.delete(c);
  c.deps.clear();

  const prev = CURRENT;
  CURRENT = c;
  try {
    c.fn();
  } finally {
    CURRENT = prev;
  }
}

function flush() {
  if (BATCH) return;
  const queue = [...PENDING];
  PENDING.clear();
  for (const c of queue) runComputation(c);
}

export function batch<T>(f: () => T): T {
  BATCH++;
  try {
    return f();
  } finally {
    BATCH--;
    flush();
  }
}

export function createSignal<T>(
  initial: T
): [() => T, (v: T | ((p: T) => T)) => void] {
  const s: Signal<T> = {
    value: initial,
    subs: new Set(),
    get() {
      if (CURRENT) {
        s.subs.add(CURRENT);
        CURRENT.deps.add(s as unknown as Signal<unknown>);
      }
      return s.value;
    },
    set(next) {
      const v =
        typeof next === "function" ? (next as (p: T) => T)(s.value) : next;
      if (Object.is(v, s.value)) return;
      s.value = v;
      for (const sub of s.subs) PENDING.add(sub);
      flush();
    },
  };
  return [() => s.get(), (v) => s.set(v)];
}

export function createMemo<T>(calc: () => T): () => T {
  const [get, set] = createSignal<T>(undefined as unknown as T);
  createEffect(() => set(calc()));
  return get;
}

export function createEffect(fn: () => void): void {
  const c: Computation = { fn, deps: new Set(), cleanups: [], parent: CURRENT };
  runComputation(c);
}

export function onCleanup(cb: Cleanup) {
  if (!CURRENT) throw new Error("onCleanup fora de um computation");
  CURRENT.cleanups.push(cb);
}

export function createRoot<T>(fn: (dispose: () => void) => T): T {
  const root: Computation = {
    fn: () => {},
    deps: new Set(),
    cleanups: [],
    parent: null,
  };
  const prev = CURRENT;
  CURRENT = root;
  try {
    return fn(() => {
      for (const cl of root.cleanups.splice(0))
        try {
          cl();
        } catch {}
      for (const d of root.deps) d.subs.clear();
      root.deps.clear();
    });
  } finally {
    CURRENT = prev;
  }
}

type Child =
  | Node
  | string
  | number
  | boolean
  | null
  | undefined
  | (() => unknown);

function isSignalGetter<T = unknown>(x: unknown): x is () => T {
  return typeof x === "function" && (x as Function).length === 0;
}

function setAttr(el: Element, name: string, value: unknown) {
  if (name === "className") name = "class";

  if (name === "style" && typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    for (const k in obj) {
      const v = obj[k];
      if (isSignalGetter(v)) {
        createEffect(() =>
          (el as HTMLElement).style.setProperty(
            k,
            String((v as () => unknown)())
          )
        );
      } else {
        (el as HTMLElement).style.setProperty(k, String(v as string | number));
      }
    }
    return;
  }

  if (/^on[A-Z]/.test(name) && typeof value === "function") {
    const ev = name.slice(2).toLowerCase();
    const handler = value as EventListener;
    el.addEventListener(ev, handler);
    onCleanup(() => el.removeEventListener(ev, handler));
    return;
  }

  if (isSignalGetter(value)) {
    createEffect(() => {
      const v = (value as () => unknown)();
      if (v == null || v === false) el.removeAttribute(name);
      else el.setAttribute(name, v === true ? "" : String(v));
    });
  } else {
    if (value == null || value === false) el.removeAttribute(name);
    else el.setAttribute(name, value === true ? "" : String(value));
  }
}

function appendChild(parent: Node, child: Child) {
  if (child == null || child === false || child === true) return;

  if (isSignalGetter(child)) {
    const marker = document.createTextNode("");
    parent.appendChild(marker);
    createEffect(() => {
      let v = (child as () => unknown)();
      if (v == null || v === false || v === true) v = "";
      if (v instanceof Node) {
        const curr = marker.nextSibling;
        if (curr !== v) {
          parent.insertBefore(v, marker.nextSibling);
          if (curr) parent.removeChild(curr);
        }
      } else {
        const text = String(v);
        if (marker.nodeValue !== text) marker.nodeValue = text;
      }
    });
    return;
  }

  if (child instanceof Node) {
    parent.appendChild(child);
  } else {
    parent.appendChild(document.createTextNode(String(child)));
  }
}

type Component<P = Record<string, unknown>> = (
  props: P & { children?: Child[] }
) => Node;

export function h(
  tag: string | Component<Record<string, unknown>>,
  props: Record<string, unknown> | null | undefined,
  ...children: Child[]
): Node {
  if (typeof tag === "function") {
    return (tag as Component<Record<string, unknown>>)({
      ...(props || {}),
      children,
    });
  }

  const el =
    tag === "svg"
      ? document.createElementNS("http://www.w3.org/2000/svg", tag)
      : document.createElement(tag);

  if (props)
    for (const k in props)
      setAttr(el, k, (props as Record<string, unknown>)[k]);
  for (const c of children.flat()) appendChild(el, c);
  return el;
}

export function Fragment(_: Record<string, unknown>, ...kids: Child[]) {
  const f = document.createDocumentFragment();
  for (const k of kids.flat()) appendChild(f, k);
  return f;
}

export function mount(node: Node, container: Element) {
  container.textContent = "";
  container.appendChild(node);
}
