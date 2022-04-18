import { useEffect, useState } from "react"
import { useWallet } from "./useWallet"

export const useBalance = () => {
  // TODO: check if supported or not
  const [wallet] = useWallet()
  const [assets, setAssets] = useState()

  useEffect(() => {
    if (!wallet) {
      return
    }
    ;(async () => {
      // TODO: InfinityWallet doesnt support queryBalance
      const result = await wallet.queryBalance()
      setAssets(result)
    })()
  }, [wallet])

  // investigate io-ts runtime type checking?
  const loading = false
  const error = false

  return [assets, { loading, error }]
}