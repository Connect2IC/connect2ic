import { contextKey } from "../context"
import { useSelector } from "@xstate/vue"
import { inject } from "vue"

export function useProviders() {
  const context = inject(contextKey)
  return useSelector(context.connectService, (state) => state.context.initializedProviders)
}
