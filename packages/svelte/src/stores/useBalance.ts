import { useWallet } from "./useWallet"
import { derived, writable, get } from "svelte/store"

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
  // TODO:
  const error = writable()
  const loading = writable(true)
  const assets = writable<Array<Asset> | undefined>()

  const refetch = async () => {
    const $wallet = get(wallet)
    if (!$wallet) {
      assets.set(undefined)
      return
    }
    const result = await $wallet.queryBalance?.()
    assets.set(result)
    loading.set(false)
    // TODO:
  }

  // TODO: refetch when wallet
  derived(wallet, ($wallet) => {
    refetch()
  })

  return [assets, { loading, error, refetch }] as const
}
