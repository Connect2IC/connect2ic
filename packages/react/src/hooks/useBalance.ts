import { useEffect, useState } from "react"
import { useConnect } from "./useConnect"
import { useWallet } from "./useWallet"
import { WalletErrors } from "@connect2ic/core/providers"
import { IConnector, IWalletConnector } from "@connect2ic/core"

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
  const wallet = useWallet()
  const { activeProvider } = useConnect()
  const [assets, setAssets] = useState<Array<Asset>>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<{ kind: WalletErrors } | undefined>()

  const refetch = async () => {
    if (!wallet || !activeProvider) {
      setAssets(undefined)
      return
    }
    const result = await (activeProvider as IConnector & IWalletConnector).queryBalance?.()
    result.match(
      (assets) => {
        setAssets(assets)
      },
      (error) => {
        setError(error)
      },
    )
    setLoading(false)
    return result
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