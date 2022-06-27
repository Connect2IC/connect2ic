import { useState } from "react"
import { useConnect } from "./useConnect"
import { useWallet } from "./useWallet"

type Props = {
  amount: number,
  to: string,
  from?: string,
}

export const useTransfer = ({ amount, to, from = undefined }: Props) => {
  // TODO: check if supported or not
  const [wallet] = useWallet()
  const { activeProvider, principal } = useConnect()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | undefined>()

  const transfer = async () => {
    if (!wallet || !activeProvider) {
      return
    }
    setLoading(true)
    const result = await activeProvider.requestTransfer({
      amount,
      to,
      from: from ?? principal,
    }).catch(e => {
      setError(e)
    })
    setLoading(false)
    return result
  }

  return [transfer, { loading, error }] as const
}