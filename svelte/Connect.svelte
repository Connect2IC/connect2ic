<script lang="ts">
  import { setContext } from "svelte"
  import {
    Dialog,
    IIConnect,
    StoicConnect,
    PlugConnect,
    MetamaskConnect,
    createII,
    createPlug,
    createStoic,
    createMetamask,
    contextKey,
  } from "./"

  export let onConnect = (connection) => {
  }
  export let onDisconnect = () => {
  }
  export let dark = false
  export let style = ""
  let status = "idle"

  // let connection = createConnection()

  let ii = createII()
  let plug = createPlug()
  let metamask = createMetamask()
  let stoic = createStoic()

  setContext(contextKey, {
    // TODO: just connection?
    ii,
    plug,
    metamask,
    stoic,
    dark,
  })

  $: {
    const connection = $ii || $plug || $stoic || $metamask
    if (status === "disconnect") {
      status = "idle"
      // provider disconnect
      connection.disconnect()
      onDisconnect()
    } else if (connection) {
      status = "connected"
      onConnect(connection)
    }
  }
</script>

{#if status === "connected"}
  <button style={style} class="connect-button"
          on:click={() => status = "disconnect"}>Disconnect
  </button>
{/if}

{#if status !== "connected"}
  <button style={style} class="connect-button"
          on:click={() => status = "selection"}>
    Connect
  </button>
{/if}

{#if status === "selection"}
  <Dialog onClose={() => status = "idle"}>
    <IIConnect />
    <StoicConnect />
    <PlugConnect />
    <MetamaskConnect />
  </Dialog>
{/if}
