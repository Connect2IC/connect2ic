import { useContext, useEffect, useState } from "react"
import { useSelector } from "@xstate/react"
import { useConnect } from "./useConnect"
import { Connect2ICContext } from "../context"

export const useWallet = () => {
  // TODO: check if supported or not
  const { connectService } = useContext(Connect2ICContext)
  const provider = useSelector(connectService, (state) => state.context.provider)
  const [wallet, setWallet] = useState(undefined)
  const supportsWallet = !!provider?.requestTransfer
  const { status } = useConnect({
    onConnect: async () => {
      // TODO: fix onConnect()
    },
    onDisconnect: () => {
      setWallet(undefined)
    },
  })

  useEffect(() => {
    if (status === "connected") {
      if (supportsWallet) {
        // TODO: kind of hacky?
        setWallet(provider)
      }
    }
  }, [status, setWallet])

  // investigate io-ts runtime type checking?
  const loading = false
  const error = false

  return [wallet, { loading, error }]
}