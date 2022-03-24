<script>
  import {
    Dialog,
    IIButton,
    StoicButton,
    PlugButton,
    MetamaskButton,
    createAuth,
  } from "./index"

  export const onConnect = (connection) => {
  }
  export const onDisconnect = () => {
  }
  export const dark = false
  export const style = ""
  export const config = {
    ii: {},
    plug: {},
    stoic: {},
    metamask: {},
  }

  const auth = createAuth({
    // providers,
    onConnect,
    onDisconnect,
  })

  let showDialog = false
  $: if ($auth.status === "connected") {
    showDialog = false
  }
</script>

{#if $auth.status === "connected"}
  <button style={style} class="connect-button" on:click={() => auth.disconnect()}>
    Disconnect
  </button>
{/if}

{#if $auth.status !== "connected"}
  <button style={style} class="connect-button" on:click={() => showDialog = true}>
    Connect
  </button>
{/if}

{#if showDialog}
  <Dialog onClose={() => showDialog = false}>
    <IIButton on:click={() => auth.connect("ii")} dark={dark} />
    <StoicButton on:click={() => auth.connect("stoic")} dark={dark} />
    <PlugButton on:click={() => auth.connect("plug")} dark={dark} />
    <MetamaskButton on:click={() => auth.connect("metamask")} dark={dark} />
  </Dialog>
{/if}
