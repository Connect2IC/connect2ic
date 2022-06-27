import { useConnect } from "./useConnect"
import { useSelector } from "@xstate/svelte"
import { getContext, onMount } from "svelte"
import { contextKey } from "../context"
import type { ContextState } from "../context"
import type { IConnector, IWalletConnector } from "@connect2ic/core"
import { derived, writable } from "svelte/store"
import type { Readable } from "svelte/store"

export const useWallet = () => {
  const { isConnected, activeProvider } = useConnect()
  const supportsWallet = derived(activeProvider, ($activeProvider, set) => set(!!$activeProvider?.meta.features.includes("wallet")))
  const wallet: Readable<IConnector & Partial<IWalletConnector> | undefined> = derived(
    [isConnected, supportsWallet, activeProvider],
    ([$isConnected, $supportsWallet, $activeProvider], set) => {
      set(
        $isConnected && $supportsWallet && $activeProvider ? ($activeProvider as IConnector & Partial<IWalletConnector>) : undefined,
      )
    },
  )
  // TODO: fix
  const loading = writable()
  const error = writable()

  return [wallet, { loading, error }] as const
}
