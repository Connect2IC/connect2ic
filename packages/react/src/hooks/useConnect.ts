import React, { useContext, useEffect } from "react"
import { useSelector } from "@xstate/react"
import { Connect2ICContext } from "../context"

type Props = {
  onConnect?: ({ provider: string }) => void
  onDisconnect?: () => void
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
    client,
  } = useContext(Connect2ICContext)
  const { principal, activeProvider, status, connectingProvider } = useSelector(client._service, (state) => ({
    principal: state.context.activeProvider?.principal,
    activeProvider: state.context.activeProvider,
    connectingProvider: state.context.connectingProvider,
    status: state.value,
  }))

  useEffect(() => {
    const unsub = client.on("connect", onConnect)
    const unsub2 = client.on("disconnect", onDisconnect)
    return () => {
      unsub()
      unsub2()
    }
  }, [client])

  return {
    principal,
    activeProvider,
    connectingProvider,
    status,
    isInitializing: client._service.state?.matches({ idle: "initializing" }) ?? false,
    isConnected: client._service.state?.matches({ idle: "connected" }) ?? false,
    isConnecting: client._service.state?.matches({ idle: "connecting" }) ?? false,
    isDisconnecting: client._service.state?.matches({ idle: "disconnecting" }) ?? false,
    isIdle: client._service.state?.matches({ idle: "idle" }) ?? false,
    connect: (provider: string) => {
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

