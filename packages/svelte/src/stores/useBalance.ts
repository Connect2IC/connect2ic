import { useWallet } from "./useWallet"
import { useConnect } from "./useConnect"
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
  const { activeProvider } = useConnect()
  // TODO:
  const error = writable()
  const loading = writable(true)
  const assets = writable<Array<Asset> | undefined>()

  const refetch = async () => {
    const $wallet = get(wallet)
    const $activeProvider = get(activeProvider)
    if (!$wallet || !$activeProvider) {
      assets.set(undefined)
      return
    }
    const result = await $activeProvider.queryBalance?.()
    assets.set(result)
    loading.set(false)
    // TODO:
  }

  wallet.subscribe(() => {
    const $wallet = get(wallet)
    if ($wallet) {
      refetch()
    }
  })

  return [assets, { loading, error, refetch }] as const
}
