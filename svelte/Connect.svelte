<script>
  import {
    Dialog,
    IIButton,
    StoicButton,
    PlugButton,
    MetamaskButton,
    createAuth,
  } from "./"

  export let onConnect = (connection) => {
  }
  export let onDisconnect = () => {
  }
  export let dark = false
  export let style = ""
  export let config = {
    ii: {},
    plug: {},
    stoic: {},
    metamask: {},
  }

  let auth = createAuth({
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
