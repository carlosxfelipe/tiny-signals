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
const DISPOSE = Symbol("d");

type NodeWithDispose = Node & { [DISPOSE]?: Cleanup };
type RefObject<T extends Element = Element> = { current: T | null };
type Ref<T extends Element = Element> = ((el: T | null) => void) | RefObject<T>;
type InnerHTML = { __html: string };

function isRefObject(x: unknown): x is RefObject<Element> {
  return !!x && typeof x === "object" && "current" in (x as object);
}

function isInnerHTML(x: unknown): x is InnerHTML {
  return !!x && typeof x === "object" && "__html" in (x as object);
}

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
  if (!CURRENT) throw new Error("onCleanup called outside of a computation");
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
      for (const cl of root.cleanups.splice(0)) {
        try {
          cl();
          // deno-lint-ignore no-empty
        } catch {}
      }
      for (const d of root.deps) d.subs.clear();
      root.deps.clear();
    });
  } finally {
    CURRENT = prev;
  }
}

export type Child =
  | Node
  | string
  | number
  | boolean
  | null
  | undefined
  | (() => unknown)
  | Array<Child>;

function isSignalGetter<T = unknown>(x: unknown): x is () => T {
  return (
    typeof x === "function" &&
    (x as (...args: unknown[]) => unknown).length === 0
  );
}

function setAttr(el: Element, name: string, value: unknown) {
  if (name === "className") name = "class";

  if (name === "dangerouslySetInnerHTML" && isInnerHTML(value)) {
    const html = value.__html;
    (el as HTMLElement).innerHTML = html == null ? "" : String(html);
    return;
  }

  if (name === "ref") {
    const r = value as Ref<Element>;
    if (typeof r === "function") {
      r(el);
      onCleanup(() => r(null));
    } else if (isRefObject(r)) {
      r.current = el;
      onCleanup(() => {
        r.current = null;
      });
    }
    return;
  }

  if (name === "style") {
    if (typeof value === "string") {
      (el as HTMLElement).style.cssText = value;
      return;
    }
    if (typeof value === "object" && value !== null) {
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
          if (v == null) (el as HTMLElement).style.removeProperty(k);
          else (el as HTMLElement).style.setProperty(k, String(v));
        }
      }
      return;
    }
  }

  if (/^on[A-Z]/.test(name) && typeof value === "function") {
    const ev = name.slice(2).toLowerCase();
    const handler = value as EventListener;
    el.addEventListener(ev, handler);
    onCleanup(() => el.removeEventListener(ev, handler));
    return;
  }

  if (name === "value") {
    if (
      el instanceof HTMLInputElement ||
      el instanceof HTMLTextAreaElement ||
      el instanceof HTMLSelectElement
    ) {
      el.value = value == null ? "" : String(value);
      return;
    }
  }

  if (name === "checked" && el instanceof HTMLInputElement) {
    el.checked = Boolean(value);
    return;
  }

  if (typeof value === "boolean") {
    if (value) el.setAttribute(name, "");
    else el.removeAttribute(name);
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

export function normalizeToNodes(value: unknown): Node[] {
  if (value == null || value === false || value === true) return [];
  if (value instanceof Node) return [value];
  if (Array.isArray(value)) {
    const out: Node[] = [];
    for (const v of (value as unknown[]).flat())
      out.push(...normalizeToNodes(v));
    return out;
  }
  return [document.createTextNode(String(value))];
}

function disposeNode(n: Node) {
  const d = (n as NodeWithDispose)[DISPOSE];
  if (d) {
    try {
      d();
      // deno-lint-ignore no-empty
    } catch {}
  }
}

export function clearRange(start: Comment, end: Comment) {
  let n = start.nextSibling;
  while (n && n !== end) {
    const next = n.nextSibling;
    disposeNode(n);
    n.parentNode?.removeChild(n);
    n = next;
  }
}

export function insertNodesAfter(ref: Node, nodes: Node[]) {
  let cursor: Node | null = ref;
  for (const n of nodes) {
    if (cursor.nextSibling) ref.parentNode!.insertBefore(n, cursor.nextSibling);
    else ref.parentNode!.appendChild(n);
    cursor = n;
  }
}

function appendDynamic(parent: Node, getter: () => unknown) {
  const start = document.createComment("");
  const end = document.createComment("");
  parent.appendChild(start);
  parent.appendChild(end);
  createEffect(() => {
    const v = getter();
    const nodes = normalizeToNodes(v);
    clearRange(start, end);
    insertNodesAfter(start, nodes);
  });
}

function appendStatic(parent: Node, child: Exclude<Child, () => unknown>) {
  if (child == null || child === false || child === true) return;
  if (Array.isArray(child)) {
    for (const c of child)
      appendStatic(parent, c as Exclude<Child, () => unknown>);
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

const SVG_NS = "http://www.w3.org/2000/svg";
const SVG_TAGS = new Set([
  "svg",
  "path",
  "g",
  "defs",
  "clipPath",
  "mask",
  "pattern",
  "linearGradient",
  "radialGradient",
  "stop",
  "circle",
  "ellipse",
  "line",
  "polyline",
  "polygon",
  "rect",
  "use",
  "symbol",
  "marker",
  "text",
  "tspan",
  "textPath",
  "foreignObject",
  "filter",
  "feGaussianBlur",
  "feOffset",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "title",
  "desc",
] as const);

export function h(
  tag: string | Component<Record<string, unknown>>,
  props: Record<string, unknown> | null | undefined,
  ...children: Child[]
): Node {
  if (typeof tag === "function") {
    let dispose: Cleanup = () => {};
    const node = createRoot((d) => {
      dispose = d;
      return (tag as Component<Record<string, unknown>>)({
        ...(props || {}),
        children,
      });
    }) as Node;
    (node as NodeWithDispose)[DISPOSE] = dispose;
    return node;
  }

  const isSvg = SVG_TAGS.has(
    tag as typeof SVG_TAGS extends Set<infer U> ? U : never
  );
  const el = isSvg
    ? document.createElementNS(SVG_NS, tag)
    : document.createElement(tag);

  if (props) {
    for (const [k, v] of Object.entries(props)) setAttr(el, k, v);
  }

  for (const c of children.flat()) {
    if (isSignalGetter(c)) appendDynamic(el, c as () => unknown);
    else appendStatic(el, c as Exclude<Child, () => unknown>);
  }

  return el;
}

export function Fragment(_: Record<string, unknown>, ...kids: Child[]) {
  const f = document.createDocumentFragment();
  for (const k of kids.flat()) {
    if (isSignalGetter(k)) appendDynamic(f, k as () => unknown);
    else appendStatic(f, k as Exclude<Child, () => unknown>);
  }
  return f;
}

export function mount(node: Node, container: Element) {
  container.textContent = "";
  container.appendChild(node);
}
