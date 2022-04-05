import { useContext, useEffect } from "react"
import { useSelector } from "@xstate/react"
import { useConnect } from "./useConnect"
import { ConnectContext } from "../context"

export const useWallet = (canisterName) => {
  // TODO: support anonymous identity?
  // TODO: support lazy loading canisters?
  // TODO: NNS, management, ledger canister support?
  const { connectService } = useContext(ConnectContext)
  const { status } = useConnect({
    onConnect: async ({ provider }) => {
      // ...
    },
  })
  const wallet = useSelector(connectService, (state) => state.context.wallet)
  const loading = false
  const error = false

  return [wallet, { loading, error }]
}