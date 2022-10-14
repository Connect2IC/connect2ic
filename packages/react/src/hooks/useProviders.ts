import { useContext, useEffect } from "react"
import { useSelector } from "@xstate/react"
import { Connect2ICContext } from "../context"
import type { Provider } from "@connect2ic/core"

export const useProviders = (): Array<Provider> => {
  const { client } = useContext(Connect2ICContext)
  // TODO: support networks
  const providers = useSelector(client._service, (state) => {
    return Object.values(state.context.providers["local"])
  })

  return providers ?? [] as const
}