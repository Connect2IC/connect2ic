<script lang="ts">
  import PlugButton from "./buttons/PlugButton.svelte"
  import createPlug from "./stores/Plug.store"

  export let darkMode = false
  export let onConnect = () => {
  }
  export let onDisconnect = () => {
  }

  let plug = createPlug({})

  $: onConnect($plug)

  let onClick = () => {
    plug.connect()
  }
</script>

<PlugButton darkMode={darkMode} on:click={onClick} />
