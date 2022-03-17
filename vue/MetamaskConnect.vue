<script lang="ts">
  import { getContext } from "svelte"
  import { contextKey } from "./index"
  import dfinityLogo from "../assets/dfinity.svg"
  import MetamaskButton from "./buttons/MetamaskButton.vue"
  import createMetamask from "../providers/Metamask"

  export let dark = false
  export let onConnect = () => {
  }
  export let onDisconnect = () => {
  }
  let metamask = createMetamask()

  $: {
    if ($metamask) {
      onConnect($metamask)
    }
  }

  let onClick = () => {
    metamask.connect()
  }
</script>

<MetamaskButton dark={dark} on:click={onClick} />