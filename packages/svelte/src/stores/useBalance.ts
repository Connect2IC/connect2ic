import { useWallet } from "./useWallet"
import { useConnect } from "./useConnect"
import { derived, writable, get } from "svelte/store"
import type { IConnector, IWalletConnector } from "@connect2ic/core"
import type { BalanceError } from "@connect2ic/core/providers"

type Asset = {
  amount: number
  canisterId: string
  decimals: number
  image?: string
  name: string
  symbol: string
}

export const useBalance = () => {
  // TODO: check if supported or not
  const [wallet] = useWallet()
  const { activeProvider } = useConnect()
  // TODO:
  const error = writable<{ kind: BalanceError }>()
  const loading = writable(true)
  const assets = writable<Array<Asset> | undefined>()

  const refetch = async () => {
    const $wallet = get(wallet)
    const $activeProvider = get(activeProvider) as IConnector & IWalletConnector
    if (!$wallet || !$activeProvider) {
      assets.set(undefined)
      return
    }
    const result = await $activeProvider.queryBalance()
    result.match(
      (a) => {
        assets.set(a)
      },
      (e) => {
        error.set(e)
      },
    )
    loading.set(false)
    // TODO:
    return result
  }

  wallet.subscribe(() => {
    const $wallet = get(wallet)
    if ($wallet) {
      refetch()
    }
  })

  return [assets, { loading, error, refetch }] as const
}
