import { useContext, useEffect, useMemo, useState } from "react"
import { useConnect } from "./useConnect"
import { Connect2ICContext } from "../context"
import type { ActorSubclass, Actor } from "@dfinity/agent"
import { IDL } from "@dfinity/candid"
import { CreateActorError, CreateActorResult } from "@connect2ic/core"
import { useQuery } from "@tanstack/react-query"

export type CanisterOptions<T> = {
  mode?: string
  network?: string
  // onInit?: (service: T) => void
}

export const useCanisterById = <T>(canisterId, options: CanisterOptions<T> = {
  mode: "auto", // "anonymous" | "connected"
  network: "local",
}) => {
  const { canisterIds } = useContext(Connect2ICContext)
  const canisterName = canisterIds[canisterId]
  // TODO: __get_candid_interface_tmp_hack ?
  return useCanister<T>(canisterName, options)
}

export const useCanisters = () => {
  const { canisters } = useContext(Connect2ICContext)
  return canisters
}

type CanisterDeclaration<T> = {
  // TODO: mandatory
  canisterId: string,
  idlFactory: IDL.InterfaceFactory,
  service?: T,
}

export const useCanister = <T>(canisterNameOrDeclaration: string | CanisterDeclaration<T>, options: CanisterOptions<T> = {}) => {
  const {
    mode = "auto", // "anonymous" | "connected"
    network = "local",
    // onInit = () => {
    // },
  } = options
  const hasCanisterName = typeof canisterNameOrDeclaration === "string"
  const { client, canisters } = useContext(Connect2ICContext)
  // TODO: broken
  // const { activeProvider, isConnected } = useConnect()
  let canisterId = hasCanisterName ? canisters[canisterNameOrDeclaration].canisterId : canisterNameOrDeclaration.canisterId
  let idlFactory = hasCanisterName ? canisters[canisterNameOrDeclaration].idlFactory : canisterNameOrDeclaration.idlFactory

  const anonymousActorQueryKey = ["canister", "anonymous", canisterId]
  const anonymousActorQuery = useQuery({
    queryKey: anonymousActorQueryKey,
    // enabled: mode === "anonymous" || mode === "auto",
    queryFn: () => client.createAnonymousActor(
      canisterId,
      idlFactory,
    ),
  })

  // TODO:
  // const connectedActorQueryKey = ["canister", "connected", canisterId]
  // const connectedActorQuery = useQuery({
  //   enabled: isConnected,
  //   queryKey: connectedActorQueryKey,
  //   queryFn: () => activeProvider!.createActor(
  //     canisterId,
  //     // @ts-ignore
  //     idlFactory,
  //   ),
  // })

  const queries = {
    // "auto": isConnected ? connectedActorQuery : anonymousActorQuery,
    "auto": anonymousActorQuery,
    "anonymous": anonymousActorQuery,
    // "connected": connectedActorQuery,
  }

  // useEffect(() => {
  //   // TODO: what happens if mode changes? does it re-init?
  //   if (queries[mode].status === "success") {
  //     onInit(queries[mode].data as T)
  //   }
  // }, [queries[mode]])

  return queries[mode]
}
