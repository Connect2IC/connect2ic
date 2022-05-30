import { inject, computed, watch } from "vue"
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
  const { connectService, action } = inject(contextKey)
  const principal = useSelector(connectService, state => state.context.principal)
  const activeProvider = useSelector(connectService, state => state.context.activeProvider)
  const { state } = useActor(connectService)
  const isConnected = computed(() => state.value.matches({ idle: "connected" }) ?? false)
  const isConnecting = computed(() => state.value.matches({ idle: "connecting" }) ?? false)
  const isDisconnecting = computed(() => state.value.matches({ idle: "disconnecting" }) ?? false)
  const isIdle = computed(() => state.value.matches({ idle: "idle" }) ?? false)

  watch(action, ($action) => {
    if ($action?.type === "onConnect") {
      // TODO: fires twice
      onConnect()
    }
    if ($action?.type === "onDisconnect") {
      onDisconnect()
    }
  })

  return {
    principal,
    activeProvider,
    isConnected,
    isConnecting,
    isDisconnecting,
    isIdle,
    connect: (provider) => {
      connectService.send({ type: "CONNECT", data: { provider } })
    },
    disconnect: () => {
      connectService.send({ type: "DISCONNECT" })
    },
  }
}

export { useConnect }