<script lang="ts">
  import { getContext } from "svelte"
  import { contextKey } from "./index"
  import PlugButton from "./buttons/PlugButton.svelte"
  import createPlug from "./stores/Plug.store"

  export let dark = false
  export let onConnect = () => {
  }
  export let onDisconnect = () => {
  }
  let { plug, dark: ctxDark } = getContext(contextKey)

  $: {
    if ($plug) {
      onConnect($plug)
    }
  }

  let onClick = () => {
    plug.connect()
  }
</script>

<PlugButton dark={dark || ctxDark} on:click={onClick} />
