import { useConnect } from "./useConnect"
import { useSelector } from "@xstate/vue"
import { inject, ref, computed } from "vue"
import type { ComputedRef, Ref } from "vue"
import { contextKey } from "../context"
import type { ActorSubclass } from "@dfinity/agent"
import type { IDL } from "@dfinity/candid"
import type { CreateActorError, CreateActorResult } from "@connect2ic/core"

// @ts-ignore
export const useCanister: <T>(canisterName: string, options?: { mode: string }) => readonly [ComputedRef<ActorSubclass<T>>, { canisterDefinition: Ref<{ canisterId: string, idlFactory: IDL.InterfaceFactory }>; error: ComputedRef<{ kind: CreateActorError }>; loading: ComputedRef<boolean> }] = <T>(
  canisterName: string,
  options: { mode: string } = {
    mode: "auto", // "anonymous" | "connected"
  },
) => {
  const { mode } = options
  const { client } = inject(contextKey)
  const anonymousActorResult = useSelector(client._service, (state) => state.context.anonymousActors[canisterName])
  const actorResult = useSelector(client._service, (state) => state.context.actors[canisterName])
  const canisterDefinition = useSelector(client._service, (state) => state.context.canisters[canisterName])
  const { isConnected } = useConnect()
  // @ts-ignore
  const chosenActorResult = computed<CreateActorResult<T>>(() => {
    return isConnected.value && actorResult.value && mode !== "anonymous" ? actorResult.value : anonymousActorResult.value
  })
  const actor = computed(() => chosenActorResult.value.isOk() ? chosenActorResult.value.value : undefined)
  const loading = computed(() => !actor.value)
  const error = computed<{ kind: CreateActorError }>(() => chosenActorResult.value.isErr() ? chosenActorResult.value.error : undefined)

  return [
    actor,
    {
      error,
      loading,
      canisterDefinition,
    },
  ] as const
}
