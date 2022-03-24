import App from "./App.svelte";
import { inspect } from "@xstate/inspect";
inspect({
    // options
    // url: 'https://statecharts.io/inspect', // (default)
    iframe: false // open in new window
});
const app = new App({
    target: document.getElementById("root"),
});
export default app;
//# sourceMappingURL=main.js.map