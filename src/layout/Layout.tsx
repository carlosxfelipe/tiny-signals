import { h } from "@tiny/tiny-signals.ts";
import { StyleSheet } from "@styles/stylesheet.ts";

interface LayoutProps {
  children?: JSX.Element | JSX.Element[];
  fluid?: boolean;
  showNavbar?: boolean;
}

export default function Layout({
  children = [],
  fluid = false,
  showNavbar = true,
}: LayoutProps) {
  return (
    <div>
      {showNavbar ? <header style={styles.navbar}>Navbar</header> : null}
      <main
        style={{
          ...styles.page,
          ...(fluid ? styles.pageFluid : {}),
        }}
      >
        {children}
      </main>
    </div>
  );
}

const styles = StyleSheet.create({
  navbar: {
    padding: "16px",
    borderBottom: "1px solid #e5e7eb",
    marginBottom: "24px",
    background: "#f9fafb",
  },
  page: {
    width: "min(100%, 1024px)",
    margin: "0 auto",
    padding: "24px clamp(14px, 4vw, 16px) 32px",
    paddingTop: "calc(24px + env(safe-area-inset-top))",
  },
  pageFluid: { width: "100%", maxWidth: "none" },
});
