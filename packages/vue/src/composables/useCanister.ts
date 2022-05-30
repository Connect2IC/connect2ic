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
  const { connectService } = inject(contextKey)
  const anonymousActor = useSelector(connectService, (state) => state.context.anonymousActors[canisterName])
  const actor = useSelector(connectService, (state) => state.context.actors[canisterName])
  const { isConnected } = useConnect()
  const canister: Ref<ActorSubclass> = computed(() => {
    return isConnected.value && actor.value && mode !== "anonymous" ? actor.value : anonymousActor.value
  })
  // TODO:
  const loading = computed(() => !canister.value)
  const error = ref(false)

  return [canister, { error, loading }] as const
}
