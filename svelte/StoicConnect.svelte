<script lang="ts">
  import StoicButton from "./buttons/StoicButton.svelte"
  import createStoic from "./stores/Plug.store"

  export let darkMode = false
  export let onConnect = () => {
  }
  export let onDisconnect = () => {
  }

  let stoic = createStoic({})

  $: onConnect($stoic)

  let onClick = () => {
    stoic.connect()
  }
</script>

<StoicButton darkMode={darkMode} on:click={onClick} />
