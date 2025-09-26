import "@styles/global.css";

import { h, mount, createRoot } from "@tiny/tiny-signals.ts";
import Layout from "@layout/Layout.tsx";
import { ROUTES, useRoute, attachRouter } from "@src/router/router.ts";

function App() {
  const route = useRoute();
  attachRouter();

  const { component: Screen, layout } = ROUTES[route()];

  return (
    <Layout fluid={layout?.fluid ?? false} showNavbar={layout?.navbar ?? true}>
      <div key={`screen:${route()}`} data-screen-root>
        <Screen />
      </div>
    </Layout>
  );
}

createRoot(() => {
  const root = document.getElementById("app")!;
  mount(<App />, root);
});
