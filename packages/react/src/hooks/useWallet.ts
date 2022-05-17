import { useContext, useEffect, useState } from "react"
import { useSelector } from "@xstate/react"
import { useConnect } from "./useConnect"
import { Connect2ICContext } from "../context"
import type { IConnector, IWalletConnector } from "@connect2ic/core"

export const useWallet = () => {
  const { connectService } = useContext(Connect2ICContext)
  const activeProvider = useSelector(connectService, (state) => state.context.activeProvider)
  const [wallet, setWallet] = useState<IConnector & Partial<IWalletConnector>>()
  // TODO: kind of hacky
  const supportsWallet = !!activeProvider?.connector.requestTransfer
  const { isConnected } = useConnect({
    onConnect: async () => {
    },
    onDisconnect: () => {
      setWallet(undefined)
    },
  })

  useEffect(() => {
    if (isConnected) {
      if (supportsWallet) {
        setWallet(activeProvider.connector)
      }
    }
  }, [setWallet])

  const loading = false
  const error = false

  return [wallet, { loading, error }] as const
}