import { useConnect } from "./useConnect"
import { useWallet } from "./useWallet"
import { derived, writable, get } from "svelte/store"
import type { Readable } from "svelte/store"

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
  // const assets: Readable<Array<Asset> | undefined> = derived([wallet, activeProvider], async ([$wallet, $activeProvider], set) => {
  //   if (!$wallet || !activeProvider) {
  //     return set(undefined)
  //   }
  //   const result = await $wallet.queryBalance?.()
  //   set(result)
  //   loading.set(false)
  // })
  const assets = writable()

  const refetch = async () => {
    const $wallet = get(wallet)
    if (!$wallet) {
      return
    }
    const result = await $wallet.queryBalance?.()
    assets.set(result)
    loading.set(false)
    // TODO:
  }

  refetch()

  return [assets, { loading, error, refetch }] as const
}
