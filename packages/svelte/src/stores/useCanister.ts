import { useConnect } from "./useConnect"
import { useSelector } from "@xstate/svelte"
import { getContext, onMount } from "svelte"
import { contextKey } from "../context"
import type { ContextState } from "../context"
import { derived, writable } from "svelte/store"
import type { Readable } from "svelte/store"
import type { ActorSubclass } from "@dfinity/agent"
import type { CreateActorResult, CreateActorError } from "@connect2ic/core"
import type { ActorMethod } from "@dfinity/agent"

export const useCanister: <Service extends Record<string, ActorMethod<unknown[], unknown>>>(canisterName: string, options?: { mode: string }) => readonly [Readable<ActorSubclass<Service> | undefined>, { canisterDefinition: Readable<unknown>; error: Readable<{ kind: CreateActorError } | undefined>; loading: Readable<boolean> }] = <Service extends Record<string, ActorMethod<unknown[], unknown>>>(
  canisterName: string,
  options: { mode: string } = {
    mode: "auto", // "anonymous" | "connected"
  },
) => {
  const { mode } = options
  const { client } = getContext<ContextState>(contextKey)
  const anonymousActorResult = useSelector(client._service, (state) => state.context.anonymousActors[canisterName])
  const actorResult = useSelector(client._service, (state) => state.context.actors[canisterName])
  const canisterDefinition = useSelector(client._service, (state) => state.context.canisters[canisterName])
  const { isConnected } = useConnect()
  const chosenActorResult: Readable<CreateActorResult<Service>> = derived([isConnected, actorResult, anonymousActorResult], ([$isConnected, $actorResult, $anonymousActorResult], set) => {
    // @ts-ignore
    set($isConnected && $actorResult && mode !== "anonymous" ? $actorResult : $anonymousActorResult)
  })
  const actor: Readable<ActorSubclass<Service> | undefined> = derived([chosenActorResult], ([$chosenActorResult], set) => {
    // @ts-ignore
    set($chosenActorResult.isOk() ? $chosenActorResult.value : undefined)
  })

  // TODO: ?
  const loading: Readable<boolean> = derived(actor, (c, set) => set(!c))
  const error: Readable<{ kind: CreateActorError } | undefined> = derived([chosenActorResult], ([$chosenActorResult], set) => {
    $chosenActorResult.isErr() ? set($chosenActorResult.error) : set(undefined)
  })

  return [
    actor,
    {
      error,
      loading,
      canisterDefinition,
    },
  ] as const
}
