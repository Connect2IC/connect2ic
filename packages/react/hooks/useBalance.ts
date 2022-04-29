import { useEffect, useState } from "react"
import { useWallet } from "./useWallet"

export const useBalance = () => {
  // TODO: check if supported or not
  const [wallet] = useWallet()
  const [assets, setAssets] = useState()

  const refresh = async () => {
    const result = await wallet.queryBalance()
    setAssets(result)
  }

  useEffect(() => {
    if (!wallet) {
      setAssets(undefined)
      return
    }
    refresh()
  }, [wallet])

  // TODO:
  const loading = false
  const error = false

  return [assets, { loading, error, refresh }]
}