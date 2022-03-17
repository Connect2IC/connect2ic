<script setup lang="ts">
const emit = defineEmits(["onClose", "onClickInside"])
const onClose = () => {
  emit("onClose")
}

const onClickInside = (e) => {
  e.stopPropagation()
  emit("onClickInside")
}
</script>

<template>
  <div @click="onClose" class="dialog-styles">
    <div @click="onClickInside" class="dialog-container">
      <slot />
    </div>
  </div>
</template>