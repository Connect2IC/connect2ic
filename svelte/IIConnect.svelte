<script lang="ts">
  import { getContext } from "svelte"
  import { contextKey } from "./index"
  import dfinityLogo from "../assets/dfinity.svg"
  import IIButton from "./buttons/IIButton.svelte"
  import createII from "./stores/II.store"

  export let dark = false
  let ctx = getContext(contextKey)
  let { ii, dark: ctxDark } = ctx
  export let onConnect = () => {
  }
  export let onDisconnect = () => {
  }

  $: {
    // let ii = $ctx
    if ($ii) {
      onConnect($ii)
    }
  }

  let onClick = () => {
    ii.connect()
  }
</script>

<IIButton dark={dark || ctxDark} on:click={onClick} />