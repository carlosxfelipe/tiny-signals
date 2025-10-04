import { h, createSignal } from "@tiny/index.ts";
import { StyleSheet } from "@styles/stylesheet.ts";

export type ButtonVariant = "solid" | "soft";
export type ButtonTone = "primary" | "neutral" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = {
  children?: JSX.Element | string | number;
  type?: "button" | "submit" | "reset";
  onClick?: (ev: MouseEvent) => void;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  block?: boolean;
  disabled?: boolean | (() => boolean);
  loading?: boolean | (() => boolean);
  style?: JSX.StyleObject;
  title?: string;
};

export default function Button({
  children,
  type = "button",
  onClick,
  variant = "soft",
  tone = "neutral",
  size = "md",
  block = false,
  disabled = false,
  loading = false,
  style,
  title,
}: ButtonProps) {
  const [hover, setHover] = createSignal(false);
  const [focused, setFocused] = createSignal(false);
  const [active, setActive] = createSignal(false);
  const isDisabled = () => asBool(disabled) || asBool(loading);

  return (
    <button
      type={type}
      title={title}
      onClick={(ev: MouseEvent) => {
        if (isDisabled()) return;
        onClick?.(ev);
      }}
      onMouseEnter={() => !isDisabled() && setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setActive(false);
      }}
      onMouseDown={() => !isDisabled() && setActive(true)}
      onMouseUp={() => setActive(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      disabled={isDisabled}
      style={StyleSheet.merge(
        styles.base,
        sizeStyles[size],
        block ? styles.block : null,
        toneStyles[tone],
        variantStyles[variant],
        {
          background: () =>
            variant === "solid"
              ? active() || hover()
                ? "var(--_bgHover)"
                : "var(--_bg)"
              : active()
              ? "var(--btn-active)"
              : hover()
              ? "var(--btn-hover)"
              : "var(--_softBg)",
          transform: () => (active() ? "translateY(1px)" : "none"),
          "box-shadow": () => (focused() ? "var(--ring)" : "var(--shadow)"),
          cursor: () => (isDisabled() ? "not-allowed" : "pointer"),
          opacity: () => (isDisabled() ? 0.6 : 1),
        },
        style || null
      )}
    >
      <span style={styles.label}>
        {() => (asBool(loading) ? "Carregando…" : children)}
      </span>
    </button>
  );
}

function asBool(v: boolean | (() => boolean)) {
  return typeof v === "function" ? (v as () => boolean)() : v;
}

const sizeStyles: Record<ButtonSize, JSX.StyleObject> = {
  sm: { padding: "8px 12px", "font-size": "12.5px" },
  md: { padding: "10px 14px", "font-size": "14px" },
  lg: { padding: "12px 18px", "font-size": "15px" },
};

const toneStyles: Record<ButtonTone, JSX.StyleObject> = StyleSheet.create({
  primary: {
    "--_bg": "var(--primary)",
    "--_bgHover": "var(--primary-hover)",
    "--_fg": "var(--on-primary)",
    "--_softBg": "var(--btn-bg)",
    "--_border": "var(--btn-border)",
  },
  neutral: {
    "--_bg": "var(--fg)",
    "--_bgHover": "#111827",
    "--_fg": "#ffffff",
    "--_softBg": "var(--btn-bg)",
    "--_border": "var(--btn-border)",
  },
  danger: {
    "--_bg": "var(--danger)",
    "--_bgHover": "var(--danger-hover)",
    "--_fg": "var(--on-error)",
    "--_softBg": "var(--btn-bg)",
    "--_border": "var(--btn-border)",
  },
});

const variantStyles: Record<ButtonVariant, JSX.StyleObject> = {
  solid: {
    background: "var(--_bg)",
    color: "var(--_fg)",
    border: "1px solid transparent",
    transition:
      "transform 0.06s ease, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease",
  },
  soft: {
    background: "var(--_softBg)",
    color: "var(--fg)",
    border: "1px solid var(--_border)",
    transition:
      "transform 0.06s ease, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease",
  },
};

const styles = StyleSheet.create({
  base: {
    display: "inline-flex",
    "align-items": "center",
    "justify-content": "center",
    gap: "8px",
    "user-select": "none",
    "-webkit-tap-highlight-color": "transparent",
    outline: "none",
    "box-shadow": "var(--shadow)",
    "border-radius": "12px",
  },
  block: { display: "flex", width: "100%" },
  label: { "font-weight": 600 },
});
