import { useEffect, useState } from "react"
import { useWallet } from "./useWallet"

export const useTransfer = ({ amount, to, from = undefined }) => {
  // TODO: check if supported or not
  const [wallet] = useWallet()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const transfer = async () => {
    if (!wallet) {
      throw new Error("Wallet not supported")
    }
    setLoading(true)
    await wallet.requestTransfer({
      amount,
      to,
      from: from ?? wallet.principal,
    }).catch(e => {
      setError(true)
    })
    setLoading(false)
  }

  useEffect(() => {
    if (!wallet) {
      return
    }
  }, [wallet])

  return [transfer, { loading, error }]
}