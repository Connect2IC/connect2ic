import { useState } from "react"
import { useConnect } from "./useConnect"

type Props = {
  amount: number,
  to: string,
  from?: string,
}

export const useTransfer = ({ amount, to, from = undefined }: Props) => {
  // TODO: check if supported or not
  const { isWallet, activeProvider, principal } = useConnect()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | undefined>()

  const transfer = async () => {
    if (!isWallet || !activeProvider) {
      return
    }
    setLoading(true)
    await activeProvider.requestTransfer({
      amount,
      to,
      from: from ?? principal,
    }).catch(e => {
      setError(e)
    })
    setLoading(false)
  }

  return [transfer, { loading, error }] as const
}