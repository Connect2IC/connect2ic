import React, { useCallback, useContext, useEffect, useState, useSyncExternalStore } from "react"
import { Connect2ICContext } from "../context"
import { CLIENT_STATUS } from "@connect2ic/core"
import { useClient } from "./useClient"

type Props = {
  onConnect?: ({ provider }: { provider: string }) => void
  onDisconnect?: () => void
  onInit?: () => void
}

export const useConnect = (props?: Props) => {
  // TODO: handle
  const {
    onConnect = () => {
    },
    onDisconnect = () => {
    },
    onInit = () => {
      // TODO: pass provider status?
    },
  } = props ?? {}
  const client = useClient()

  // TODO: selector?
  const {
    activeProvider,
    status,
    connectingProvider,
    // principal,
  } = useSyncExternalStore(client.subscribe, client.getSnapshot)

  useEffect(() => {
    const unsub = client.on("connect", onConnect)
    const unsub2 = client.on("disconnect", onDisconnect)
    const unsub3 = client.on("init", onInit)
    return () => {
      unsub()
      unsub2()
      unsub3()
    }
  }, [client])

  return {
    principal: activeProvider?.principal,
    activeProvider,
    connectingProvider,
    status,
    isInitializing: status === CLIENT_STATUS.INITIALIZING,
    isConnected: status === CLIENT_STATUS.CONNECTED,
    isConnecting: status === CLIENT_STATUS.CONNECTING,
    isDisconnecting: status === CLIENT_STATUS.DISCONNECTING,
    isLocked: status === CLIENT_STATUS.LOCKED,
    isIdle: status === CLIENT_STATUS.IDLE,
    connect: async (provider: string) => client.connect(provider),
    cancelConnect: () => client.cancelConnect(),
    disconnect: async () => client.disconnect(),
  } as const
}
