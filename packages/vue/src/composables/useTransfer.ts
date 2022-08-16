import { useWallet } from "./useWallet"
import { ref } from "vue"
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
  const loading = ref<boolean>(true)
  const payload = ref()
  const error = ref<{ kind: TransferError }>()

  const transfer = async () => {
    const $wallet = wallet.value
    if (!$wallet) {
      return err({ kind: TransferError.NotConnected })
    }
    loading.value = true
    const result = await $wallet.requestTransfer({
      amount,
      to,
    })
    result.match(
      (a) => {
        payload.value = a
      },
      (e) => {
        error.value = e
      },
    )
    loading.value = false
    return result
  }

  return [transfer, { loading, error }] as const
}
