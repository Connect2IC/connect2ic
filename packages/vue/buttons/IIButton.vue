<script setup lang="ts">
import { dfinityLogo } from "@connect2ic/core"
import "@connect2ic/core/connect2ic.css"

const props = defineProps({
  dark: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button class="button-styles ii-styles" :style="dark ? `` : `background: #f4f4f4; color: black;`">
    <img style="width: 55px;" class="img-styles" :src="dfinityLogo" />
    <div>
    <span class="button-label">
      Internet Identity
    </span>
      <span>
    Connect with your Internet Identity
    </span>
    </div>
  </button>
</template>
