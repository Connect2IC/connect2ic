import { useContext, useEffect, useState } from "react"
import { useSelector } from "@xstate/react"
import { useConnect } from "./useConnect"
import { Connect2ICContext } from "../context"
import type { ActorSubclass, Actor } from "@dfinity/agent"
import { IDL } from "@dfinity/candid"

// TODO: ??
// @ts-ignore
export const useCanisterAdvanced = <T>(
  canisterConfig: {
    canisterId: string
    idlFactory: IDL.InterfaceFactory
    network: "ic" | "local"
  },
  options: { mode: string } = {
    mode: "auto", // "anonymous" | "connected"
  },
) => {
  const { mode } = options
  const { client } = useContext(Connect2ICContext)

  useEffect(() => {
    console.log(canisterConfig)
    // if (!canisterConfig) {
    //   return
    // }
    // // TODO: reuse canisters?
    // if (client.activeProvider) {
    //   // TODO: use client to create
    //   // TODO: select network
    //   client.createActor(canisterConfig)
    //   // client.activeProvider.createActor(canisterInfo.canisterId, canisterInfo.idlFactory)
    // } else {
    //   client.createAnonymousActor(canisterConfig)
    //   // client.anonymousProvider.createActor(canisterInfo.canisterId, canisterInfo.idlFactory)
    // }
    // // TODO: canisterConfig makes it update infinitely
  }, [canisterConfig])

  // TODO: move to client?
  const anonymousCanister = useSelector(client._service, (state) => {
    return state.context.canisters.anonymous[canisterConfig.network][canisterConfig.canisterId]?.["anonymous"]
  })
  const providerCanister = useSelector(client._service, (state) => {
    if (!state.context.activeProvider) {
      return
    }
    return state.context.canisters[state.context.activeProvider.meta.id]?.[canisterConfig.network][canisterConfig.canisterId]
  })
  const { isConnected } = useConnect()

  const canister = isConnected && (mode !== "anonymous") && providerCanister ? providerCanister : anonymousCanister

  return [
    canister?.actor.isOk() ? canister.actor.value : undefined,
    {
      error: canister?.actor.isErr() ? canister.actor.error : undefined,
      // TODO: ?
      loading: !(canister?.actor),
      idl: canister?.idlFactory,
    },
  ] as const
}