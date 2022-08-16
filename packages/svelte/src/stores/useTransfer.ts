import { useConnect } from "./useConnect"
import { useWallet } from "./useWallet"
import { derived, writable, get } from "svelte/store"
import type { Readable } from "svelte/store"
import type { IConnector, IWalletConnector, TransferResult } from "@connect2ic/core"
import { TransferError } from "@connect2ic/core/providers"
import { err } from "neverthrow"

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
  const error = writable<{ kind: TransferError }>()
  const payload = writable<{ height: number }>()

  const transfer = async (): Promise<TransferResult> => {
    const $wallet = get(wallet)
    const $activeProvider = get(activeProvider)
    if (!$wallet || !$activeProvider) {
      return err({ kind: TransferError.NotConnected })
    }
    loading.set(true)
    const result = await ($activeProvider as IConnector & IWalletConnector).requestTransfer?.({
      amount,
      to,
    })
    result.match(
      (p) => {
        payload.set(p)
      },
      (e) => {
        error.set(e)
      },
    )
    loading.set(false)
    return result
  }

  return [transfer, { loading, error }] as const
}
