import { useEffect, useState } from "react"
import { useWallet } from "./useWallet"

export const useBalance = () => {
  // TODO: check if supported or not
  const [wallet] = useWallet()
  const [assets, setAssets] = useState()
  const [loading, setLoading] = useState(true)
  // TODO:
  const [error, setError] = useState(false)

  const refresh = async () => {
    const result = await wallet.queryBalance()
    setAssets(result)
    setLoading(false)
  }

  useEffect(() => {
    if (!wallet) {
      setAssets(undefined)
      return
    }
    refresh()
  }, [wallet])

  return [assets, { loading, error, refresh }]
}