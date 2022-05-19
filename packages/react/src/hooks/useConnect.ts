import React, { useContext, useEffect } from "react"
import { useSelector } from "@xstate/react"
import { Connect2ICContext } from "../context"

type Props = {
  onConnect: ({ provider: string }) => void
  onDisconnect: () => void
}

export const useConnect = (props?: Props) => {
  // TODO: handle
  const {
    onConnect = () => {
    },
    onDisconnect = () => {
    },
  } = props ?? {}
  const {
    connectService,
    action,
  } = useContext(Connect2ICContext)
  const { principal, activeProvider } = useSelector(connectService, (state) => ({
    principal: state.context.principal,
    activeProvider: state.context.activeProvider,
  }))
  const isWallet = !!activeProvider?.connector.requestTransfer

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
    isWallet,
    isConnected: connectService.state?.matches({ idle: "connected" }) ?? false,
    isConnecting: connectService.state?.matches({ idle: "connecting" }) ?? false,
    isDisconnecting: connectService.state?.matches({ idle: "disconnecting" }) ?? false,
    isIdle: connectService.state?.matches({ idle: "idle" }) ?? false,
    connect: (provider) => {
      connectService.send({ type: "CONNECT", data: { provider } })
    },
    disconnect: () => {
      connectService.send({ type: "DISCONNECT" })
    },
  } as const
}

