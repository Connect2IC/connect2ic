import { useWallet } from "./useWallet"
import { ref, computed } from "vue"

type Props = {
  message?: string
}

export const useSignMessage = ({ message }: Props) => {
  // TODO: check if supported or not
  const [wallet] = useWallet()

  // TODO: fix
  const signMessage = () => {
    const $wallet = wallet.value
    if (!$wallet) {
      return
    }
    $wallet.signMessage?.({ message })
  }

  const loading = ref(false)
  const error = ref(false)

  return [signMessage, { loading, error }] as const
}