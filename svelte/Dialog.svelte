<script lang="ts">
  import IIConnect from "./IIConnect.svelte"
  import StoicConnect from "./StoicConnect.svelte"
  import PlugConnect from "./PlugConnect.svelte"

  export let plug = { whitelist: [], host: window.location.origin }
  export let stoic = {}
  export let ii = {}
  export let signInText = "Sign in"
  export let onClose = () => {
  }
  export let onSelect = () => {
  }

  const onClickInside = (e) => {
    e.stopPropagation()
  }
</script>

<div on:click={onClose} class="dialog-styles">
  <div on:click={onClickInside} class="dialog-container">
    <slot />
<!--    -->
<!--    <button on:click={close} class={"close-styles"}>-->
<!--      Close-->
<!--    </button>-->
  </div>
</div>

