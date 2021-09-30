<script lang="ts">
  import IIConnect from "./IIConnect.svelte"
  import StoicConnect from "./StoicConnect.svelte"
  import PlugConnect from "./PlugConnect.svelte"
  // import useConnect2IC from "./Connect2IC.store"

  export let onConnect = () => {}
  export let onDisconnect = () => {}
  export let providers = ["ii", "stoic", "plug"]
  export let signInText = "Sign in"
  export let signOutText = "Sign out"

  const signOutStyles = {
    padding: "8px 25px",
    borderRadius: "10px",
    border: "3px solid black",
    fontSize: "20px",
    fontWeight: 600,
    color: "black",
    background: "transparent",
    outline: 0,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  }

  const selectStyles = {
    padding: "8px 25px",
    borderRadius: "10px",
    border: "3px solid black",
    fontSize: "20px",
    fontWeight: 600,
    background: "transparent",
    outline: 0,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  }
  let status = "idle"

  const connectHandler = (args) => {
    status = "signedIn"
    onConnect(args)
  }

  const disconnectHandler = (args) => {
    status = "idle"
    onDisconnect(args)
  }

  const onSelect = () => {
    status = "selecting"
  }

  const close = () => {
    status = "idle"
  }

  const onClickInside = (e) => {
    e.stopPropagation()
  }
</script>

{#if status !== "signedIn"}
  <button on:click={onSelect}>Sign in</button>
{/if}

{#if status === "signedIn"}
  <button style={signOutStyles} on:click={disconnectHandler} class="auth-button">{signOutText}</button>
{/if}

{#if status === "selecting"}
  <div on:click={close} class="dialog-styles">
    <div on:click={onClickInside} style={{
      padding: "30px 50px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      color: "white",
      cursor: "initial",
    }}>
      <button class={"connect-2-ic"}>{signInText}</button>
      <IIConnect onConnect={connectHandler} />
      <div style="padding: 5px; width: 100%;"></div>
      <StoicConnect onConnect={connectHandler} />
      <div style="padding: 5px; width: 100%;"></div>
      <PlugConnect onConnect={connectHandler} />

      <button on:click={close} class={"close-styles"}>
        Close
      </button>
    </div>
  </div>
{/if}

