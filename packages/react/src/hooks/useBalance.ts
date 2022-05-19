import { useEffect, useState } from "react"
import { useConnect } from "./useConnect"

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
  const {isWallet, activeProvider} = useConnect()
  const [assets, setAssets] = useState<Array<Asset>>()
  const [loading, setLoading] = useState(true)
  // TODO:
  const [error, setError] = useState(false)

  const refresh = async () => {
    if (!isWallet || !activeProvider) {
      return
    }
    const result = await activeProvider.queryBalance?.()
    setAssets(result)
    setLoading(false)
  }

  useEffect(() => {
    if (!isWallet) {
      setAssets(undefined)
      return
    }
    refresh()
  }, [isWallet])

  return [assets, { loading, error, refresh }] as const
}