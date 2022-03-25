<script setup lang="ts">
import { plugLight, plugDark } from "@connect2ic/core"
import "@connect2ic/core/style"

const props = defineProps({
  dark: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button class="button-styles plug-styles" :style="dark ? `` : `background: #f4f4f4; color: black;`">
    <img class="img-styles" :src="dark ? plugDark : plugLight" />
    <div>
    <span class="button-label">
      Plug
    </span>
      <span>
    Connect with your Plug wallet
    </span>
    </div>
  </button>
</template>
