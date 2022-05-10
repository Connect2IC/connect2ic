import { useEffect, useState } from "react"
import { useWallet } from "./useWallet"

export const useSignMessage = ({ message }) => {
  // TODO: check if supported or not
  const [wallet] = useWallet()
  const signMessage = () => {
    wallet.signMessage({ message })
  }

  useEffect(() => {
    if (!wallet) {
      return
    }
  }, [wallet])

  // investigate io-ts runtime type checking?
  const loading = false
  const error = false

  return [signMessage, { loading, error }]
}