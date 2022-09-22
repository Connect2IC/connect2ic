<script setup lang="ts">
import { useConnect, useDialog } from "../composables"

const emit = defineEmits(["onConnect", "onDisconnect"])
const props = defineProps({
  dark: {
    type: Boolean,
    default: false,
  },
  style: {
    type: String,
    default: "",
  },
})

//@ts-ignore
const isICX = !!window.icx

const { open } = useDialog()

const onConnect = () => {
  emit("onConnect", {})
}

const onDisconnect = () => {
  emit("onDisconnect", {})
}

let { isConnected, disconnect, connect } = useConnect({
  // providers,
  onConnect,
  onDisconnect,
})

</script>

<template>
  <button v-if="isConnected" class="connect-button" @click="() => disconnect()">
    Disconnect
  </button>

  <button v-if="!isConnected" class="connect-button" @click="() => isICX ? connect('icx') : open()">
    Connect
  </button>
</template>

