<script setup lang="ts">
import { ref, onMounted, computed, watch, watchEffect, reactive } from "vue"
import {
  Dialog,
  IIButton,
  StoicButton,
  PlugButton,
  MetamaskButton,
  useAuth,
} from "./index"

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

const onConnect = () => {
  emit("onConnect", {})
}

const onDisconnect = () => {
  emit("onDisconnect", {})
}

let auth = useAuth({
  // providers,
  onConnect,
  onDisconnect,
})

let showDialog = ref(false)

watchEffect( () => {
  if (auth.status.value === "connected") {
    showDialog.value = false
  }
})

</script>

<template>
  <button v-if="auth.status.value === 'connected'" class="connect-button" @click="() => auth.disconnect()">
    Disconnect
  </button>

  <button v-if="auth.status.value !== 'connected'" class="connect-button" @click="() => showDialog = true">
    ConnectButton
  </button>

  <Dialog v-if="showDialog" @on-close="() => showDialog = false">
    <IIButton @click="() => auth.connect('ii')" :dark="dark" />
    <StoicButton @click="() => auth.connect('stoic')" :dark="dark" />
    <PlugButton @click="() => auth.connect('plug')" :dark="dark" />
    <MetamaskButton @click="() => auth.connect('metamask')" :dark="dark" />
  </Dialog>
</template>

