import { useContext, useState } from "react"
import { useSelector } from "@xstate/react"
import { useConnect } from "./useConnect"
import { Connect2ICContext } from "../context"
import type { ActorSubclass, Actor } from "@dfinity/agent"
import { IDL } from "@dfinity/candid"

type UseCanisterOptions = {
  mode: string
  network: string
  // idlFactory?: IDL.InterfaceFactory
}

// TODO: ??
export const useCanister = <T>(canisterName, options: UseCanisterOptions = {
  mode: "auto", // "anonymous" | "connected"
  // TODO:
  network: "local",
}) => {
  const { mode } = options
  const { client } = useContext(Connect2ICContext)
  const { activeProvider, isConnected } = useConnect()

  // TODO: put all inside getCanister in client?
  const canisterId = useSelector(client._service, (state) => {
    // TODO: network switching
    return state.context.canisters[canisterName].local.canisterId
  })
  const anonymousCanister = useSelector(client._service, (state) => {
    // TODO: network switching
    return state.context.anonymousActors[canisterName]?.local
  })
  const providerCanister = useSelector(client._service, (state) => {
    if (!activeProvider) {
      return
    }
    // TODO: network switching
    return state.context.actors[canisterName]?.local
  })
  const canister = isConnected && (mode !== "anonymous") && providerCanister ? providerCanister : anonymousCanister

  return [
    canister?.actor.isOk() ? canister.actor.value : undefined,
    {
      error: canister?.actor.isErr() ? canister.actor.error : undefined,
      // TODO: ?
      loading: !(canister?.actor),
      idl: canister?.idlFactory,
    },
  ]
}