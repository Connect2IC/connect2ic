import { useConnect } from "./useConnect"
import { useWallet } from "./useWallet"
import { derived, writable, get } from "svelte/store"
import type { Readable } from "svelte/store"

type Props = {
  amount: number,
  to: string,
  from?: string,
}

export const useTransfer = ({ amount, to, from = undefined }: Props) => {
  // TODO: check if supported or not
  const [wallet] = useWallet()
  const { activeProvider, principal } = useConnect()
  const loading = writable(true)
  const error = writable()

  const transfer = async () => {
    const $wallet = get(wallet)
    if (!$wallet) {
      return
    }
    loading.set(true)
    await $wallet.requestTransfer?.({
      amount,
      to,
      from: from ?? principal,
    }).catch(e => {
      error.set(e)
    })
    loading.set(false)
  }

  return [transfer, { loading, error }] as const
}
