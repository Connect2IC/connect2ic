import { useConnect } from "./useConnect"

type Props = {
  message?: string
}

export const useSignMessage = ({ message }: Props) => {
  // TODO: check if supported or not
  const {activeProvider, isWallet} = useConnect()

  const signMessage = () => {
    if (!isWallet || !activeProvider) {
      return
    }
    activeProvider.signMessage?.({ message })
  }

  const loading = false
  const error = false

  return [signMessage, { loading, error }] as const
}