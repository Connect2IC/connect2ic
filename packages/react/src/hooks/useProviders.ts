import { useContext, useEffect } from "react"
import { useSelector } from "@xstate/react"
import { Connect2ICContext } from "../context"
import type { Provider } from "@connect2ic/core"

export const useProviders = (): Array<Provider> => {
  const { connectService } = useContext(Connect2ICContext)
  const providers = useSelector(connectService, (state) => state.context.initializedProviders)

  return providers ?? [] as const
}