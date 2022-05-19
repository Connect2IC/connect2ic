<script>
  import {
    ConnectDialog,
    useConnect,
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

  const connect = useConnect({
    // providers,
    onConnect,
    onDisconnect,
  })

  let showDialog = false
  $: if ($connect.isConnected) {
    showDialog = false
  }
</script>

{#if $connect.isConnected}
  <button style={style} class="connect-button" on:click={() => connect.disconnect()}>
    Disconnect
  </button>
{/if}

{#if $connect.isConnected}
  <button style={style} class="connect-button" on:click={() => showDialog = true}>
    ConnectButton
  </button>
{/if}

{#if showDialog}
  <ConnectDialog onClose={() => showDialog = false}>
<!--    <IIButton on:click={() => connect.connect("ii")} dark={dark} />-->
  </COnnectDialog>
{/if}
