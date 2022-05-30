<script setup lang="ts">
import { ref, watchEffect, computed, provide, onMounted } from "vue"
import type { Ref } from "vue"
import { connectMachine } from "@connect2ic/core"
import type { RootContext, RootEvent, ProviderOptions } from "@connect2ic/core"
import type { State, Interpreter } from "xstate"
import { contextKey } from "./context"
import type { ContextState } from "./context"
import { useMachine, useSelector, useInterpret } from "@xstate/vue"
import type { IDL } from "@dfinity/candid"

type CanisterMap = {
  [canisterName: string]: {
    canisterId: string,
    idlFactory: IDL.InterfaceFactory,
  }
}

let open = ref(false)
const dialog = {
  open: () => {
    open.value = true
  },
  close: () => {
    open.value = false
  },
  isOpen: open,
}
let action = ref<{ type: string, context: RootContext, event: RootEvent }>()

const { canisters = {}, dev = true, whitelist, host, providers = [], autoConnect = true } = defineProps<{
  canisters?: CanisterMap
  whitelist?: Array<string>
  host?: string
  dev?: boolean
  providers: Array<ProviderOptions>
  autoConnect?: boolean
}>()

const connectService = useInterpret(connectMachine, {
  devTools: true,
  actions: {
    onConnect: (context, event) => {
      Object.entries(canisters).forEach(([canisterName, val]) => {
        const { canisterId, idlFactory } = val
        connectService.send({ type: "CREATE_ACTOR", data: { canisterId, idlFactory, canisterName } })
      })
      action.value = { type: "onConnect", context, event }
    },
    onDisconnect: (context, event) => {
      action.value = { type: "onDisconnect", context, event }
    },
    onInit: (context, event) => {
      Object.entries(canisters).forEach(([canisterName, val]) => {
        const { canisterId, idlFactory } = val
        connectService.send({ type: "CREATE_ANONYMOUS_ACTOR", data: { canisterId, idlFactory, canisterName } })
      })
    },
  },
})

connectService.send({
  type: "INIT",
  data: {
    dev,
    whitelist: whitelist ?? Object.values(canisters).map(canister => (canister as any).canisterId),
    host,
    providers,
    autoConnect,
  },
})

provide(contextKey, {
  dialog,
  action,
  canisters: ref(canisters),
  connectService,
})

</script>
<template>
  <slot></slot>
</template>
