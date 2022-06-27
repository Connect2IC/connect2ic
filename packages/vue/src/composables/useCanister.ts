import { useConnect } from "./useConnect"
import { useSelector } from "@xstate/vue"
import { inject, ref, computed } from "vue"
import type { Ref } from "vue"
import { contextKey } from "../context"
import type { ActorSubclass } from "@dfinity/agent"

export const useCanister = (
  canisterName: string,
  options: { mode: string } = {
    mode: "auto", // "anonymous" | "connected"
  },
) => {
  const { mode } = options
  const { client } = inject(contextKey)
  const anonymousActor = useSelector(client._service, (state) => state.context.anonymousActors[canisterName])
  const actor = useSelector(client._service, (state) => state.context.actors[canisterName])
  const { isConnected } = useConnect()
  // @ts-ignore
  const canister: Ref<ActorSubclass> = computed(() => {
    return isConnected.value && actor.value && mode !== "anonymous" ? actor.value : anonymousActor.value
  })
  // TODO:
  const loading = computed(() => !canister.value)
  const error = ref(false)

  return [canister, { error, loading }] as const
}
