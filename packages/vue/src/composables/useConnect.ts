import { inject, computed,  onMounted, onUnmounted } from "vue"
import { useSelector } from "@xstate/vue"
import { contextKey } from "../context"
import { useActor } from "@xstate/vue"

type Props = {
  onConnect?: () => void
  onDisconnect?: () => void
}

const useConnect = (props: Props = {}) => {
  const {
    onConnect = () => {
    },
    onDisconnect = () => {
    },
  } = props
  const { client } = inject(contextKey)
  const principal = useSelector(client._service, state => state.context.principal)
  const activeProvider = useSelector(client._service, state => state.context.activeProvider)
  const status = useSelector(client._service, state => state.value)
  const { state } = useActor(client._service)
  const isConnected = computed(() => state.value.matches({ idle: "connected" }) ?? false)
  const isInitializing = computed(() => state.value.matches({ idle: "initializing" }) ?? false)
  const isConnecting = computed(() => state.value.matches({ idle: "connecting" }) ?? false)
  const isDisconnecting = computed(() => state.value.matches({ idle: "disconnecting" }) ?? false)
  const isIdle = computed(() => state.value.matches({ idle: "idle" }) ?? false)

  let unsub
  let unsub2
  onMounted(() => {
    unsub = client.on("connect", onConnect)
    unsub2 = client.on("disconnect", onDisconnect)
  })
  onUnmounted(() => {
    unsub()
    unsub2()
  })

  return {
    principal,
    status,
    activeProvider,
    isConnected,
    isConnecting,
    isDisconnecting,
    isInitializing,
    isIdle,
    connect: (provider) => {
      client.connect(provider)
    },
    cancelConnect: () => {
      client.cancelConnect()
    },
    disconnect: () => {
      client.disconnect()
    },
  } as const
}

export { useConnect }