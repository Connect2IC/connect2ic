import { useSelector } from "@xstate/svelte"
import { getContext, onMount } from "svelte"
import { contextKey } from "../context"
import type { ContextState } from "../context"
import { derived, readable } from "svelte/store"

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
  const { connectService, action, connectState } = getContext<ContextState>(contextKey)
  const principal = useSelector(connectService, state => state.context.principal)
  const activeProvider = useSelector(connectService, state => state.context.activeProvider)
  const isConnected = derived(connectState, ($connectState, set) => {
    set($connectState.matches({ idle: "connected" }) ?? false)
  })
  const isConnecting = derived(connectState, ($connectState, set) => set($connectState.matches({ idle: "connecting" }) ?? false))
  const isDisconnecting = derived(connectState, ($connectState, set) => set($connectState.matches({ idle: "disconnecting" }) ?? false))
  const isIdle = derived(connectState, ($connectState, set) => set($connectState.matches({ idle: "idle" }) ?? false))

  action!.subscribe(($action) => {
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