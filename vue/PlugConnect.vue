<script lang="ts">
  import { getContext } from "svelte"
  import { contextKey } from "./index"
  import PlugButton from "./buttons/PlugButton.vue"
  import createPlug from "../providers/Plug"

  export let dark = false
  export let onConnect = () => {
  }
  export let onDisconnect = () => {
  }
  let plug = createPlug()

  $: {
    if ($plug) {
      onConnect($plug)
    }
  }

  let onClick = () => {
    plug.connect()
  }
</script>

<PlugButton dark={dark} on:click={onClick} />
