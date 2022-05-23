import { useConnect } from "./useConnect"
import { useSelector } from "@xstate/svelte"
import { getContext, onMount } from "svelte"
import { contextKey } from "../context"
import type { ContextState } from "../context"
import type { IConnector, IWalletConnector } from "@connect2ic/core"
import { derived } from "svelte/store"
import type { Readable } from "svelte/store"

export const useWallet = () => {
  const { connectService } = getContext<ContextState>(contextKey)
  const activeProvider = useSelector(connectService, state => state.context.activeProvider)
  // TODO: kind of hacky
  const supportsWallet = derived(activeProvider, ($activeProvider, set) => set(!!$activeProvider?.connector.requestTransfer))
  const { isConnected } = useConnect()
  const wallet: Readable<IConnector & Partial<IWalletConnector> | undefined> = derived(
    [isConnected, supportsWallet, activeProvider],
    ([$isConnected, $supportsWallet, $activeProvider], set) => {
      set(
        $isConnected && $supportsWallet && $activeProvider ? ($activeProvider.connector as IConnector & Partial<IWalletConnector>) : undefined,
      )
    },
  )
  const loading = false
  const error = false

  return [wallet, { loading, error }] as const
}
