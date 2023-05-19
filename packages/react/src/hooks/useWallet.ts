import { useConnect } from "./useConnect"
import type { IWalletConnector } from "@connect2ic/core"

export const useWallet = (): IWalletConnector | undefined => {
  const { isConnected, activeProvider } = useConnect()
  return isConnected ? activeProvider!.wallets[0] : undefined
}