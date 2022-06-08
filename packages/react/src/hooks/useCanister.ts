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
  const { connectService, canisters } = useContext(Connect2ICContext)

  const anonymousActor = useSelector(connectService, (state) => state.context.anonymousActors[canisterName])
  const actor = useSelector(connectService, (state) => state.context.actors[canisterName])
  const { isConnected } = useConnect()

  const canister = (isConnected && actor && mode !== "anonymous") ? actor : anonymousActor

  // TODO:
  const loading = !canister
  const error = false

  return [canister, { error, loading, canisterDefinition: canisters[canisterName] }] as const
}