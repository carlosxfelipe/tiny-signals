import { h } from "@tiny/index.ts";
import { StyleSheet } from "@styles/stylesheet.ts";
import Navbar from "@components/Navbar.tsx";

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
      {showNavbar ? <Navbar /> : null}
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
  page: {
    width: "min(100%, 1024px)",
    margin: "0 auto",
    padding: "24px clamp(14px, 4vw, 16px) 32px",
    "padding-top": "calc(24px + env(safe-area-inset-top))",
  },
  pageFluid: {
    width: "100%",
    "max-width": "none",
  },
});
