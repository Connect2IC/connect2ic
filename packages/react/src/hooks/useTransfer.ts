import { useState } from "react"
import { useWallet } from "./useWallet"

type Props = {
  amount: number,
  to: string,
  from?: string,
}

export const useTransfer = ({ amount, to, from = undefined }: Props) => {
  // TODO: check if supported or not
  const [wallet] = useWallet()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | undefined>()

  const transfer = async () => {
    if (!wallet) {
      return
    }
    setLoading(true)
    await wallet.requestTransfer!({
      amount,
      to,
      from: from ?? wallet.principal,
    }).catch(e => {
      setError(e)
    })
    setLoading(false)
  }

  return [transfer, { loading, error }] as const
}