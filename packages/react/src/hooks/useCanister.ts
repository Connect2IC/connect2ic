import { useContext } from "react"
import { useSelector } from "@xstate/react"
import { useConnect } from "./useConnect"
import { Connect2ICContext } from "../context"
import type { IDL } from "@dfinity/candid"
import { ActorSubclass } from "@dfinity/agent"

// TODO: Figure out ts error
// @ts-ignore
export const useCanister: (canisterName: string, options?: { mode: string }) => readonly [ActorSubclass, { canisterDefinition: { canisterId: string; idlFactory: IDL.InterfaceFactory }; error: boolean; loading: boolean }] = (
  canisterName: string,
  options: { mode: string } = {
    mode: "auto", // "anonymous" | "connected"
  },
) => {
  const { mode } = options
  const { client } = useContext(Connect2ICContext)

  const anonymousActor = useSelector(client._service, (state) => state.context.anonymousActors[canisterName])
  const actor = useSelector(client._service, (state) => state.context.actors[canisterName])
  const canisterDefinition = useSelector(client._service, (state) => state.context.canisters[canisterName])
  const { isConnected } = useConnect()

  const signedIn = (isConnected && actor && mode !== "anonymous")
  const canister = signedIn ? actor : anonymousActor

  // TODO:
  const loading = !canister
  const error = false

  return [
    canister,
    {
      error,
      loading,
      canisterDefinition,
    },
  ] as const
}