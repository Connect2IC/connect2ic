import React, { useContext, useEffect } from "react"
import { useSelector } from "@xstate/react"
import { Connect2ICContext } from "../context"

const selectState = state => ({
  principal: state.context.principal,
  activeProvider: state.context.provider,
  status: state.value.idle,
})

export const useConnect = (props = {}) => {
  // TODO: handle
  const {
    onConnect = () => {
    },
    onDisconnect = () => {
    },
  } = props
  const {
    connectService,
    action,
  } = useContext(Connect2ICContext)
  const { principal, activeProvider, status } = useSelector(connectService, selectState)

  useEffect(() => {
    // TODO: Some other workaround? useSelector still has old state when action fires.
    if (action?.type === "onConnect" && activeProvider) {
      onConnect({ provider: activeProvider })
    }
    if (action?.type === "onDisconnect") {
      onDisconnect()
    }
  }, [action, activeProvider])

  return {
    principal,
    activeProvider,
    status,
    isConnected: status === "connected",
    isConnecting: status === "connecting",
    isDisconnecting: status === "disconnecting",
    isIdle: status === "idle",
    connect: (provider) => {
      connectService.send({ type: "CONNECT", data: { provider } })
    },
    disconnect: () => {
      connectService.send({ type: "DISCONNECT" })
    },
  }
}

