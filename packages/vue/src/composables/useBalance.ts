import { useWallet } from "./useWallet"
import { ref, watch } from "vue"
import type { BalanceError } from "@connect2ic/core"

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
  const error = ref<{ kind: BalanceError }>()
  const loading = ref<boolean>(true)
  const assets = ref<Array<Asset>>()

  const refetch = async () => {
    const $wallet = wallet.value
    if (!$wallet) {
      assets.value = undefined
      return
    }
    const result = await $wallet.queryBalance()
    result.match(
      (a) => {
        assets.value = a
      },
      (e) => {
        error.value = e
      },
    )
    loading.value = false
    return result
  }

  watch(wallet, ($wallet) => {
    refetch()
  })

  return [assets, { loading, error, refetch }] as const
}
