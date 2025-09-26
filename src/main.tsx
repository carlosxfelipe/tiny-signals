import { h, mount, createRoot } from "@tiny/tiny-signals.ts";
import CounterScreen from "@screens/CounterScreen.tsx";

createRoot(() => {
  const app = document.getElementById("app")!;
  mount(<CounterScreen initial={0} />, app);
});
