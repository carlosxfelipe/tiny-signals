import { h } from "@tiny/tiny-signals.ts";
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
  const isDisabled = () => asBool(disabled) || asBool(loading);

  return (
    <button
      type={type}
      title={title}
      onClick={(ev: MouseEvent) => {
        if (isDisabled()) return;
        onClick?.(ev);
      }}
      disabled={isDisabled}
      style={StyleSheet.merge(
        styles.base,
        sizeStyles[size],
        block ? styles.block : null,
        toneStyles[tone],
        variantStyles[variant],
        {
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
  sm: { padding: "6px 12px", fontSize: "12.5px", borderRadius: "8px" },
  md: { padding: "8px 14px", fontSize: "14px", borderRadius: "10px" },
  lg: { padding: "10px 18px", fontSize: "15px", borderRadius: "12px" },
};

const toneStyles: Record<ButtonTone, JSX.StyleObject> = StyleSheet.create({
  primary: {
    "--_bg": "var(--primary)",
    "--_bgHover": "var(--primary-hover)",
    "--_fg": "#ffffff",
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
    "--_fg": "#ffffff",
    "--_softBg": "var(--btn-bg)",
    "--_border": "var(--btn-border)",
  },
});

const variantStyles: Record<ButtonVariant, JSX.StyleObject> = {
  solid: {
    background: "var(--_bg)",
    color: "var(--_fg)",
    border: "1px solid transparent",
    transition: "background 120ms ease-out, box-shadow 120ms ease",
  },
  soft: {
    background: "var(--_softBg)",
    color: "var(--fg)",
    border: "1px solid var(--_border)",
  },
};

const styles = StyleSheet.create({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
    outline: "none",
    boxShadow: "var(--shadow)",
    transition:
      "opacity 120ms ease, background 120ms ease, box-shadow 120ms ease",
  },
  block: { display: "flex", width: "100%" },
  label: { fontWeight: 600 },
});
