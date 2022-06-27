import { useConnect } from "./useConnect"
import { useWallet } from "./useWallet"
import { ref } from "vue"

type Props = {
  amount: number,
  to: string,
  from?: string,
}

export const useTransfer = ({ amount, to, from = undefined }: Props) => {
  // TODO: check if supported or not
  const [wallet] = useWallet()
  const { principal } = useConnect()
  const loading = ref(true)
  const error = ref()

  const transfer = async () => {
    const $wallet = wallet.value
    if (!$wallet) {
      return
    }
    loading.value = true
    const result = await $wallet.requestTransfer?.({
      amount,
      to,
    }).catch(e => {
      error.value = e
    })
    loading.value = false
    return result
  }

  return [transfer, { loading, error }] as const
}
