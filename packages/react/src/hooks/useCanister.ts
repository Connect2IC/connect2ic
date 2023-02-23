import { useContext, useEffect, useMemo, useState } from "react"
import { useConnect } from "./useConnect"
import { Connect2ICContext } from "../context"
import type { ActorSubclass, Actor } from "@dfinity/agent"
import { IDL } from "@dfinity/candid"
import { CreateActorError, CreateActorResult } from "@connect2ic/core"

export const useCanisterById = <T>(canisterId, options: UseCanisterOptions<T> = {
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

export type CanisterOptions<T> = {
  mode?: string
  network?: string
}

type CanisterDeclaration<T> = {
  // TODO: mandatory
  canisterId: string,
  idlFactory: IDL.InterfaceFactory,
  service?: T,
}

// TODO: ??
export const useCanister = <T>(canisterNameOrDeclaration: string | CanisterDeclaration<T>, options: CanisterOptions<T> = {
  mode: "auto", // "anonymous" | "connected"
  network: "local",
}): [T | undefined, { error?: CreateActorError, loading: boolean, idl: IDL.InterfaceFactory, canisterId: string }] => {
  const hasCanisterName = typeof canisterNameOrDeclaration === "string"
  // if (!hasCanisterName) {
  //   options = canisterNameOrDeclaration as CanisterDeclaration<T>
  // }
  const { mode } = options
  const { client, canisters } = useContext(Connect2ICContext)
  const { activeProvider, isConnected } = useConnect()
  let canisterId = hasCanisterName ? canisters[canisterNameOrDeclaration].canisterId : canisterNameOrDeclaration.canisterId
  let idlFactory = hasCanisterName ? canisters[canisterNameOrDeclaration].idlFactory : canisterNameOrDeclaration.idlFactory
  const [anonymousCanister, setAnonymousCanister] = useState<ActorSubclass<T>>()
  const [authCanister, setAuthCanister] = useState<ActorSubclass<T>>()
  const modes = {
    "auto": ((mode === "auto") && isConnected) ? authCanister : anonymousCanister,
    "anonymous": ((mode === "anonymous") && !isConnected) ? anonymousCanister : undefined,
    "connected": ((mode === "connected") && isConnected) ? authCanister : undefined,
  }
  // TODO: get error type
  const canisterResult: CreateActorResult<T> = modes[mode]

  // TODO: reuse actors when used multiple times
  // See react-query
  useEffect(() => {
    (async () => {
      const anonymousActor = await client.createAnonymousActor(
        canisterId,
        idlFactory,
      )
      setAnonymousCanister(anonymousActor)
    })()
    // TODO: options?
  }, [canisterId, idlFactory, client])

  useEffect(() => {
    if (!activeProvider) {
      return
    }
    (async () => {
      const authActor = await activeProvider.createActor(
        canisterId,
        // @ts-ignore
        idlFactory,
      )
      setAuthCanister(authActor)
    })()
    // TODO: options?
  }, [canisterId, idlFactory, activeProvider])

  let actor
  if (canisterResult?.isOk()) {
    actor = canisterResult.value
  }
  let error
  if (canisterResult?.isErr()) {
    error = canisterResult.error
  }
  // TODO: ?
  let loading = !canisterResult

  return [
    actor as typeof canisterNameOrDeclaration.service,
    {
      error,
      loading,
      // TODO: force idlFactory to be defined
      idl: idlFactory!,
      canisterId: hasCanisterName ? canisters[canisterNameOrDeclaration].canisterId : canisterId!,
    },
  ]
}