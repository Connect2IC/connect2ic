<script lang="ts">
  export let onClose = () => {
  }

  const onClickInside = (e) => {
    e.stopPropagation()
  }
</script>

<div on:click={onClose} class="dialog-styles">
  <div on:click={onClickInside} class="dialog-container">
    <slot />
  </div>
</div>