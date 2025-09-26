export {};

declare global {
  namespace JSX {
    type StyleScalar = string | number | null | undefined;
    type StyleValue = StyleScalar | (() => StyleScalar);
    type StyleObject = Record<string, StyleValue>;

    type Element = Node;

    interface ElementChildrenAttribute {
      children: unknown;
    }

    interface IntrinsicAttributes {
      key?: unknown;
      ref?:
        | ((el: globalThis.Element | null) => void)
        | { current: globalThis.Element | null }
        | null;
    }

    interface DOMProps {
      class?: string;
      className?: string;
      id?: string;
      style?: string | StyleObject;
      dangerouslySetInnerHTML?: { __html: string };
      [k: `on${string}`]: unknown;
      [attr: string]: unknown;
    }

    interface IntrinsicElements {
      [elemName: string]: DOMProps;
    }
  }
}
