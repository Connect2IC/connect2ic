import { createApp } from "vue"
import App from "./App.vue"
import { inspect } from "@xstate/inspect"

inspect({
  iframe: false,
})

createApp(App).mount("#root")
