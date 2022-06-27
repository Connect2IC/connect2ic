import { useWallet } from "./useWallet"
import { ref, watch } from "vue"

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
  const error = ref()
  const loading = ref(true)
  const assets = ref()

  // TODO: fix
  const refetch = async () => {
    const $wallet = wallet.value
    if (!$wallet) {
      assets.value = undefined
      return
    }
    const result = await $wallet.queryBalance?.()
    assets.value = result
    loading.value = false
    return result
  }

  watch(wallet, ($wallet) => {
    refetch()
  })

  return [assets, { loading, error, refetch }] as const
}
