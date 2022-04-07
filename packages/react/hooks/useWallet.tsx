import { useContext, useEffect } from "react"
import { useSelector } from "@xstate/react"
import { useConnect } from "./useConnect"
import { ConnectContext } from "../context"

export const useWallet = () => {
  // TODO: check if supported or not
  const { connectService } = useContext(ConnectContext)
  const { status } = useConnect({
    onConnect: async ({ provider }) => {
      // ...
    },
  })
  const provider = useSelector(connectService, (state) => state.context.provider)
  const wallet = provider && {
    requestTransfer: (...args) => provider.requestTransfer(...args),
    address: provider.principal,
  }
  const loading = false
  const error = false

  return [wallet, { loading, error }]
}