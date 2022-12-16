import { useContext, useEffect, useMemo, useState } from "react"
import { useSelector } from "@xstate/react"
import { useConnect } from "./useConnect"
import { Connect2ICContext } from "../context"
import type { ActorSubclass, Actor } from "@dfinity/agent"
import { IDL } from "@dfinity/candid"

export const useCanisterById = <T>(canisterId, options: UseCanisterOptions = {
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

export type UseCanisterOptions = {
  mode: string
  network: string
  // idlFactory?: IDL.InterfaceFactory
  canisterId?: string,
  idlFactory?: IDL.InterfaceFactory,
}

// TODO: ??
export const useCanister = <T>(canisterName?, options: UseCanisterOptions = {
  mode: "auto", // "anonymous" | "connected"
  network: "local",
}) => {
  const hasCanisterName = typeof canisterName !== "object"
  if (!hasCanisterName) {
    options = canisterName as UseCanisterOptions
  }
  const { mode } = options
  const { client, canisters } = useContext(Connect2ICContext)
  const { activeProvider, isConnected } = useConnect()
  let canisterId = hasCanisterName ? canisters[canisterName].canisterId : options.canisterId
  let idlFactory = hasCanisterName ? canisters[canisterName].idlFactory : options.idlFactory
  const [anonymousCanister, setAnonymousCanister] = useState<ActorSubclass<any>>()
  const [authCanister, setAuthCanister] = useState<ActorSubclass<any>>()
  const modes = {
    "auto": ((mode === "auto") && isConnected) ? authCanister : anonymousCanister,
    "anonymous": ((mode === "anonymous") && !isConnected) ? anonymousCanister : undefined,
    "connected": ((mode === "connected") && isConnected) ? authCanister : undefined,
  }
  const canister = modes[mode]

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

  return [
    canister?.isOk() ? canister.value : undefined,
    {
      error: canister?.isErr() ? canister.error : undefined,
      // TODO: ?
      loading: !(canister),
      idl: idlFactory,
      canisterId: canisterId || canisters[canisterName].canisterId,
    },
  ]
}