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
  config: {
    type: Object,
    default: {
      ii: {},
      plug: {},
      stoic: {},
      metamask: {},
    },
  },
})

const { open } = useDialog()

const onConnect = () => {
  emit("onConnect", {})
}

const onDisconnect = () => {
  emit("onDisconnect", {})
}

let { isConnected, disconnect } = useConnect({
  // providers,
  onConnect,
  onDisconnect,
})

</script>

<template>
  <button v-if="isConnected" class="connect-button" @click="() => disconnect()">
    Disconnect
  </button>

  <button v-if="!isConnected" class="connect-button" @click="() => open()">
    Connect
  </button>
</template>

