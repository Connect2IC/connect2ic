<script setup lang="ts">
import { astroxLogo } from "@connect2ic/core"
import "@connect2ic/core/style.css"

const props = defineProps({
  dark: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button class="button-styles ii-styles" :style="dark ? `` : `background: #f4f4f4; color: black;`">
    <img style="width: 55px;" class="img-styles" :src="astroxLogo" />
    <div>
    <span class="button-label">
      AstroX
    </span>
      <span>
    Connect with your AstroX identity
    </span>
    </div>
  </button>
</template>
