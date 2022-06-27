import { contextKey } from "../context"
import type { ContextState } from "../context"
import { getContext } from "svelte"
import { useSelector } from "@xstate/svelte"

export function useProviders() {
  const context = getContext<ContextState>(contextKey)
  // const { connectService } = useContext(Connect2ICContext)
  const providers = useSelector(context.client._service, (state) => state.context.providers)
  return providers
}
