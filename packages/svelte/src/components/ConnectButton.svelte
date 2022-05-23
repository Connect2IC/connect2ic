<script lang="ts">
  import { useConnect, useDialog } from "../stores/index.ts"

  export const onConnect: () => void = () => {
  }
  export const onDisconnect: () => void = () => {
  }
  export const dark: boolean = false
  export const style: string = ""

  const { open } = useDialog()
  const { isConnected, disconnect } = useConnect({
    onConnect,
    onDisconnect,
  })
</script>

{#if $isConnected}
  <button style={style} class="connect-button" on:click={() => disconnect()}>
    Disconnect
  </button>
{/if}

{#if !$isConnected}
  <button style={style} class="connect-button" on:click={() => open()}>
    Connect
  </button>
{/if}
