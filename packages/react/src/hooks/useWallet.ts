import { useContext, useEffect, useState } from "react"
import { useSelector } from "@xstate/react"
import { useConnect } from "./useConnect"
import { Connect2ICContext } from "../context"
import type { IConnector, IWalletConnector } from "@connect2ic/core"

export const useWallet = (): IWalletConnector | undefined => {
  const { client } = useContext(Connect2ICContext)
  const { isConnected, activeProvider } = useConnect()
  const wallet = isConnected ? activeProvider!.wallets[0] : undefined

  return wallet
}