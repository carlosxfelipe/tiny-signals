import HomePage from "@pages/HomePage.tsx";
import CounterPage from "@pages/CounterPage.tsx";
import CepPage from "@pages/CepPage.tsx";
import AboutPage from "@pages/AboutPage.tsx";

export const ROUTE_DEFS = [
  {
    path: "#/" as const,
    component: HomePage,
    layout: { fluid: false, navbar: true },
  },
  {
    path: "#/counter" as const,
    component: CounterPage,
    layout: { fluid: false, navbar: true },
  },
  {
    path: "#/cep" as const,
    component: CepPage,
    layout: { fluid: false, navbar: true },
  },
  {
    path: "#/about" as const,
    component: AboutPage,
    layout: { fluid: false, navbar: true },
  },
] as const;

export type Route = (typeof ROUTE_DEFS)[number]["path"];
type ScreenCmp = () => JSX.Element;
type LayoutMeta = { fluid?: boolean; navbar?: boolean };

export const ROUTES: Record<
  Route,
  { component: ScreenCmp; layout?: LayoutMeta }
> = Object.fromEntries(
  ROUTE_DEFS.map((r) => [r.path, { component: r.component, layout: r.layout }])
) as Record<Route, { component: ScreenCmp; layout?: LayoutMeta }>;
