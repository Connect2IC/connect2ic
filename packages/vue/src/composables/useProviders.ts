import { contextKey } from "../context"
import { useSelector } from "@xstate/vue"
import { inject } from "vue"

export function useProviders() {
  const {client} = inject(contextKey)
  return useSelector(client._service, (state) => state.context.providers)
}
