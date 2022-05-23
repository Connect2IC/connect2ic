import { useConnect } from "./useConnect"
import { useSelector } from "@xstate/svelte"
import { getContext, onMount } from "svelte"
import { contextKey } from "../context"
import type { ContextState } from "../context"
import { derived, writable } from "svelte/store"
import type { Readable } from "svelte/store"
import type { ActorSubclass } from "@dfinity/agent"

export const useCanister = (
  canisterName: string,
  options: { mode: string } = {
    mode: "auto", // "anonymous" | "connected"
  },
) => {
  const { mode } = options
  const { connectService } = getContext<ContextState>(contextKey)
  const anonymousActor = useSelector(connectService, (state) => state.context.anonymousActors[canisterName])
  const actor = useSelector(connectService, (state) => state.context.actors[canisterName])
  const { isConnected } = useConnect()
  const canister: Readable<ActorSubclass> = derived([isConnected, actor, anonymousActor], ([$isConnected, $actor, $anonymousActor], set) => {
    set($isConnected && $actor && mode !== "anonymous" ? $actor : $anonymousActor)
  })
  // TODO:
  const loading: Readable<boolean> = derived(canister, (c, set) => set(!c))
  const error = false

  return [canister, { error, loading }] as const
}
