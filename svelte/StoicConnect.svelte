<script lang="ts">
  import { getContext } from "svelte"
  import { contextKey } from "./index"
  import StoicButton from "./buttons/StoicButton.svelte"
  import createStoic from "./stores/Stoic.store"

  export let dark = false
  export let onConnect = () => {
  }
  export let onDisconnect = () => {
  }
  let { stoic, dark: ctxDark } = getContext(contextKey)

  $: {
    if ($stoic) {
      onConnect($stoic)
    }
  }

  let onClick = () => {
    stoic.connect()
  }
</script>

<StoicButton dark={dark || ctxDark} on:click={onClick} />
