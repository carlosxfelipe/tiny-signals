import CounterScreen from "@screens/CounterScreen.tsx";

export const ROUTE_DEFS = [
  {
    path: "#/counter" as const,
    component: CounterScreen,
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
