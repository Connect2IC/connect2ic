<script lang="ts">
  import type { RootContext, RootEvent } from "@connect2ic/core"
  import { contextKey } from "./context.ts"
  import type { ContextState } from "./context.ts"
  import { setContext } from "svelte"
  import { readable, writable } from "svelte/store"

  export let client

  let open = writable(false)
  const dialog = {
    open: () => {
      $open = true
    },
    close: () => {
      $open = false
    },
    isOpen: open,
  }
  let action = writable<{ type: string, context: RootContext, event: RootEvent }>(undefined)

  setContext<ContextState>(contextKey, {
    client,
    dialog,
  })
</script>
<slot></slot>