import { useEffect, useState } from "react"
import { useConnect } from "./useConnect"
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
  const { activeProvider } = useConnect()
  const [assets, setAssets] = useState<Array<Asset>>()
  const [loading, setLoading] = useState(true)
  // TODO:
  const [error, setError] = useState(false)

  const refetch = async () => {
    if (!wallet || !activeProvider) {
      setAssets(undefined)
      return
    }
    const result = await activeProvider.connector.queryBalance?.()
    setAssets(result)
    setLoading(false)
  }

  useEffect(() => {
    if (!wallet) {
      setAssets(undefined)
      return
    }
    refetch()
  }, [wallet])

  return [assets, { loading, error, refetch }] as const
}