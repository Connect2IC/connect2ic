import { useContext, useState } from "react"
import { useSelector } from "@xstate/react"
import { useConnect } from "./useConnect"
import { Connect2ICContext } from "../context"
import type { ActorSubclass, Actor } from "@dfinity/agent"
import { IDL } from "@dfinity/candid"

// TODO: ??
export const useCanister = <T>(
  canisterName: string,
  options: { mode: string } = {
    mode: "auto", // "anonymous" | "connected"
  },
) => {
  const { mode } = options
  const { client } = useContext(Connect2ICContext)
  const { activeProvider, isConnected } = useConnect()

  // TODO: put all inside getCanister in client?
  const canisterId = useSelector(client._service, (state) => {
    // TODO: network switching
    console.log(state.context, canisterName)
    // @ts-ignore
    return state.context.networksConfig.local.canisters[canisterName].canisterId
  })
  const anonymousCanister = useSelector(client._service, (state) => {
    // TODO: network switching
    return state.context.networks.local.anonymousProvider[canisterId]
  })
  const providerCanister = useSelector(client._service, (state) => {
    if (!activeProvider) {
      return
    }
    // TODO: network switching
    return state.context.networks.local.providers[activeProvider.meta.id].canisters[canisterId]
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