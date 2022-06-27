import { useConnect } from "./useConnect"
import { useWallet } from "./useWallet"
import { derived, writable, get } from "svelte/store"
import type { Readable } from "svelte/store"

type Props = {
  amount: number,
  to: string,
  from?: string,
}

export const useTransfer = ({ amount, to }: Props) => {
  // TODO: check if supported or not
  const [wallet] = useWallet()
  const { activeProvider, principal } = useConnect()
  const loading = writable(true)
  const error = writable()

  const transfer = async () => {
    const $wallet = get(wallet)
    const $activeProvider = get(activeProvider)
    if (!$wallet || !$activeProvider) {
      return
    }
    loading.set(true)
    const result = await $activeProvider.requestTransfer?.({
      amount,
      to,
    }).catch(e => {
      error.set(e)
    })
    loading.set(false)
    return result
  }

  return [transfer, { loading, error }] as const
}
