<script lang="ts">
  import { connectMachine } from "@connect2ic/core"
  import { interpret } from "xstate"
  import { contextKey } from "./context"
  import { setContext } from "svelte"
  import { derived, writable } from "svelte/store"

  export const canisters = {}
  export const whitelist = undefined
  export const host = undefined
  export const dev = false
  export const providers = []
  export const autoConnect = true

  const connectService = interpret(connectMachine, { devTools: true }).start()
  let open = writable(false)
  const dialog = {
    open: () => $open = true,
    close: () => $open = false,
    isOpen: $open,
  }
  let action = {}

  // derived()

  let state = writable({
    connectService,
    dialog,
    action,
    canisters,
  })

  setContext(contextKey, state)
</script>
