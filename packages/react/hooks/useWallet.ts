import { useContext, useEffect, useState } from "react"
import { useSelector } from "@xstate/react"
import { useConnect } from "./useConnect"
import { Connect2ICContext } from "../context"

export const useWallet = () => {
  // TODO: check if supported or not
  const { connectService } = useContext(Connect2ICContext)
  const activeProvider = useSelector(connectService, (state) => state.context.activeProvider)
  const [wallet, setWallet] = useState(undefined)
  const supportsWallet = !!activeProvider?.connector.requestTransfer
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
      console.log({ activeProvider })
      if (supportsWallet) {
        // TODO: kind of hacky?
        setWallet(activeProvider.connector)
      }
    }
  }, [status, setWallet])

  // investigate io-ts runtime type checking?
  const loading = false
  const error = false

  return [wallet, { loading, error }]
}