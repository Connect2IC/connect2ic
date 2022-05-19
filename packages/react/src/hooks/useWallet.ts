import { useContext, useEffect, useState } from "react"
import { useSelector } from "@xstate/react"
import { useConnect } from "./useConnect"
import { Connect2ICContext } from "../context"
import type { IConnector, IWalletConnector } from "@connect2ic/core"

export const useWallet = () => {
  const { connectService } = useContext(Connect2ICContext)
  const activeProvider = useSelector(connectService, (state) => state.context.activeProvider)
  // TODO: kind of hacky
  const supportsWallet = !!activeProvider?.connector.requestTransfer
  const { isConnected } = useConnect()
  const wallet = isConnected && supportsWallet ? (activeProvider.connector as IConnector & Partial<IWalletConnector>) : undefined
  const loading = false
  const error = false

  return [wallet, { loading, error }] as const
}