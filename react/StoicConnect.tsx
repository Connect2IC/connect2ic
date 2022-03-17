<script lang="ts">
  import { getContext } from "svelte"
  import { contextKey } from "./index"
  import StoicButton from "./buttons/StoicButton.svelte"
  import createStoic from "../providers/Stoic"

  export let dark = false
  export let onConnect = () => {
  }
  export let onDisconnect = () => {
  }
  let stoic = createStoic()

  $: {
    if ($stoic) {
      onConnect($stoic)
    }
  }

  let onClick = () => {
    stoic.connect()
  }
</script>

<StoicButton dark={dark} on:click={onClick} />
