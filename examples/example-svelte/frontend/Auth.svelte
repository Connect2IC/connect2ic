<script lang="ts">
  import { Dialog, IIConnect, StoicConnect, PlugConnect, MetamaskConnect } from "connect2ic/svelte"

  let signedIn = false
  let showSelection = false
  let onConnect = ({ plug, stoic, ii, error }) => {
    if (plug) {
      alert(plug)
    }
  }
  let onDisconnect = () => {
  }

  let darkMode = false
</script>

{#if !signedIn}
  <button on:click={() => showSelection = true}>Sign in</button>
{/if}

{#if signedIn}
  <button on:click={() => signedIn = false}>Sign out</button>
{/if}

{#if showSelection}
  <Dialog onClose={() => showSelection = false}>
    <IIConnect darkMode={darkMode} onConnect={onConnect} onDisconnect={onDisconnect} />
    <StoicConnect darkMode={darkMode} onConnect={onConnect} onDisconnect={onDisconnect} />
    <PlugConnect darkMode={darkMode} onConnect={onConnect} onDisconnect={onDisconnect} />
    <MetamaskConnect darkMode={darkMode} onConnect={onConnect} onDisconnect={onDisconnect} />
  </Dialog>
{/if}