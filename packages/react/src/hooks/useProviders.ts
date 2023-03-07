import { useCallback, useContext, useEffect, useSyncExternalStore } from "react"
import { useSelector } from "@xstate/react"
import { Connect2ICContext } from "../context"
import type { IConnector } from "@connect2ic/core"

export const useProviders = (): Array<IConnector> => {
  const { client } = useContext(Connect2ICContext)
  // TODO: selector
  const { providers } = useSyncExternalStore(client.subscribe, client.getSnapshot)

  return providers ?? [] as const
}