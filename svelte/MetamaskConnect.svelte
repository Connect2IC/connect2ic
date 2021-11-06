<script lang="ts">
  import { getContext } from "svelte"
  import { contextKey } from "./index"
  import dfinityLogo from "../assets/dfinity.svg"
  import MetamaskButton from "./buttons/MetamaskButton.svelte"
  import createMetamask from "./stores/Metamask.store"

  export let dark = false
  export let onConnect = () => {
  }
  export let onDisconnect = () => {
  }
  let { metamask, dark: ctxDark } = getContext(contextKey)

  $: {
    if ($metamask) {
      onConnect($metamask)
    }
  }

  let onClick = () => {
    metamask.connect()
  }
</script>

<MetamaskButton dark={dark || ctxDark} on:click={onClick} />