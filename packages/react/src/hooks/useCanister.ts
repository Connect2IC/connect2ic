import { useContext, useState } from "react"
import { useSelector } from "@xstate/react"
import { useConnect } from "./useConnect"
import { Connect2ICContext } from "../context"
import type { ActorSubclass, Actor } from "@dfinity/agent"
import { IDL } from "@dfinity/candid"

// TODO: ??
// @ts-ignore
export const useCanister: <T>(canisterName: string, options?: { mode: string }) => readonly [ActorSubclass, { canisterDefinition: any; error: any; loading: boolean }] = <T>(
  canisterName: string,
  options: { mode: string } = {
    mode: "auto", // "anonymous" | "connected"
  },
) => {
  const { mode } = options
  const { client } = useContext(Connect2ICContext)

  const anonymousActorResult = useSelector(client._service, (state) => state.context.anonymousActors[canisterName])
  const actorResult = useSelector(client._service, (state) => state.context.actors[canisterName])
  const canisterDefinition = useSelector(client._service, (state) => state.context.canisters[canisterName])
  const { isConnected } = useConnect()

  const signedIn = (isConnected && actorResult && mode !== "anonymous")
  const actor = signedIn ? actorResult : anonymousActorResult

  return [
    actor.isOk() ? actor.value : undefined,
    {
      error: actor.isErr() ? actor.error : undefined,
      // TODO: ?
      loading: !actor,
      canisterDefinition,
    },
  ] as const
}