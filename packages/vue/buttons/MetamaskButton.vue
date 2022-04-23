<script setup lang="ts">
import { metamaskLogo } from "@connect2ic/core"
import "@connect2ic/core/style.css"

const props = defineProps({
  dark: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button class="button-styles metamask-styles" :style="dark ? `` : `background: #f4f4f4; color: black;`">
    <img class="img-styles" :src="metamaskLogo" />
    <div>
    <span class="button-label">
      Metamask
    </span>
      <span>
    ConnectButton with your Metamask wallet
    </span>
    </div>
  </button>
</template>
