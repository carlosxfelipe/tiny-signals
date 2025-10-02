import "@styles/global.css";
import "@styles/navbar.css";

import { h, mount, createRoot } from "@tiny/index.ts";
import Layout from "@layout/Layout.tsx";
import { ROUTES, useRoute, attachRouter } from "@src/router/router.ts";

function App() {
  const route = useRoute();
  return (
    <div>
      {() => {
        const { component: Screen, layout } = ROUTES[route()];
        return (
          <Layout
            fluid={layout?.fluid ?? false}
            showNavbar={layout?.navbar ?? true}
          >
            <div data-screen-root>
              <Screen />
            </div>
          </Layout>
        );
      }}
    </div>
  );
}

createRoot(() => {
  const detach = attachRouter();
  const root = document.getElementById("app")!;
  mount(<App />, root);
  addEventListener("beforeunload", detach);
});
