<script lang="ts">
  import dfinityLogo from "../assets/dfinity.svg"
  import MetamaskButton from "./buttons/MetamaskButton.svelte"
  import createII from "./stores/II.store"

  export let darkMode = false
  export let onConnect = () => {
  }
  export let onDisconnect = () => {
  }

  let ii = createII({})

  $: onConnect($ii)

  let onClick = () => {
    ii.connect()
  }
</script>

<MetamaskButton darkMode={darkMode} on:click={onClick} />