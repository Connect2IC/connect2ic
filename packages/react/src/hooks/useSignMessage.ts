import { useWallet } from "./useWallet"

type Props = {
  message?: string
}

export const useSignMessage = ({ message }: Props) => {
  // TODO: check if supported or not
  const [wallet] = useWallet()

  const signMessage = () => {
    if (!wallet) {
      return
    }
    wallet.signMessage?.({ message })
  }

  const loading = false
  const error = false

  return [signMessage, { loading, error }] as const
}