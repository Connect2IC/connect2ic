import { useContext, useEffect, useState } from "react"
import { useSelector } from "@xstate/react"
import { useConnect } from "./useConnect"
import { Connect2ICContext } from "../context"
import type { IConnector, IWalletConnector } from "@connect2ic/core"

export const useWallet = () => {
  const { client } = useContext(Connect2ICContext)
  const activeProvider = useSelector(client._service, (state) => state.context.activeProvider)
  const supportsWallet = !!activeProvider?.meta.features.includes("wallet")
  const { isConnected } = useConnect()
  const wallet = isConnected && supportsWallet ? (activeProvider as IConnector & Partial<IWalletConnector>) : undefined

  return [wallet] as const
}