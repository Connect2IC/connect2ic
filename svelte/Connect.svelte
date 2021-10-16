<script lang="ts">
  import createAuth from "./stores/Connect2IC.store"
  import Dialog from "./Dialog.svelte"

  export let plug = { whitelist: [], host: window.location.origin }
  export let stoic = {}
  export let ii = {}

  export let onConnect = () => {
  }
  export let onDisconnect = () => {
  }

  let auth = createAuth({ plug, ii, stoic })

  $: onConnect($auth)

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

  const onSelect = (args) => {
    auth.connect(args)
  }

  const onSignOut = (args) => {
    auth.disconnect(args)
  }

  let showSelection = false

  const onSignIn = () => {
    showSelection = true
  }

  const onClose = () => {
    showSelection = false
  }
</script>

{#if $auth.status !== "signed_in"}
  <button on:click={onSignIn}>{signInText}</button>
{/if}

{#if $auth.status === "signed_in"}
  <button style={signOutStyles} on:click={onSignOut} class="auth-button">{signOutText}</button>
{/if}

{#if showSelection}
  <Dialog onSelect={onSelect} onClose={onClose} />
{/if}

