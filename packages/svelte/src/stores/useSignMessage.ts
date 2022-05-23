import { useWallet } from "./useWallet"
import { derived, writable, get } from "svelte/store"

type Props = {
  message?: string
}

export const useSignMessage = ({ message }: Props) => {
  // TODO: check if supported or not
  const [wallet] = useWallet()

  const signMessage = () => {
    const $wallet = get(wallet)
    if (!$wallet) {
      return
    }
    $wallet.signMessage?.({ message })
  }

  const loading = writable(false)
  const error = writable(false)

  return [signMessage, { loading, error }] as const
}