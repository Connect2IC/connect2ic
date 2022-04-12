import { useContext, useEffect } from "react"
import { useSelector } from "@xstate/react"
import { ConnectContext } from "../context"

export const useProviders = () => {
  const { connectService } = useContext(ConnectContext)
  const providers = useSelector(connectService, (state) => state.context.providers)
  const loading = false
  const error = false

  // TODO:
  // + add / remove ?
  // + give info about which type (identity, wallet) ?

  return [providers || [], { loading, error }]
}