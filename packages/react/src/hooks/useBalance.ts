import { useEffect, useState } from "react"
import { useWallet } from "./useWallet"

type Asset = {
  amount: number
  canisterId: string
  decimals: number
  image?: string
  name: string
  symbol: string
}

export const useBalance = () => {
  // TODO: check if supported or not
  const [wallet] = useWallet()
  const [assets, setAssets] = useState<Array<Asset>>()
  const [loading, setLoading] = useState(true)
  // TODO:
  const [error, setError] = useState(false)

  const refresh = async () => {
    if (!wallet) {
      return
    }
    const result = await wallet.queryBalance?.()
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

  return [assets, { loading, error, refresh }] as const
}