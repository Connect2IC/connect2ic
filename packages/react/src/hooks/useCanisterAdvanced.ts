import { useContext, useEffect, useState } from "react"
import { useSelector } from "@xstate/react"
import { useConnect } from "./useConnect"
import { Connect2ICContext } from "../context"
import type { ActorSubclass, Actor } from "@dfinity/agent"
import { IDL } from "@dfinity/candid"
import { useClient } from "./useClient"

// TODO: ??
// @ts-ignore
export const useCanisterAdvanced = <T>(
  canisterConfig: {
    canisterId: string
    idlFactory: IDL.InterfaceFactory
    network: "ic" | "local" | string
  },
  options: { mode?: string } = {
    mode: "anonymous", // "anonymous" | "connected"
  },
) => {
  const { mode } = options
  const client = useClient()
  const { activeProvider, isConnected } = useConnect()
  // TODO: put all inside getCanister in client?
  const [anonymousCanister, setAnonymousCanister] = useState<ActorSubclass<any>>()
  const [providerCanister, setProviderCanister] = useState<ActorSubclass<any>>()
  const canister = isConnected && (mode !== "anonymous") && providerCanister ? providerCanister : anonymousCanister

  useEffect(() => {
    ;(async () => {
      const result = await client.createAnonymousActor(canisterConfig.canisterId, canisterConfig.idlFactory)
      if (result.isOk()) {
        setAnonymousCanister(result.value)
      }
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      if (isConnected) {
        const result = await client.createActor(canisterConfig.canisterId, canisterConfig.idlFactory)
        if (result.isOk()) {
          setProviderCanister(result.value)
        }
      }
    })()
    // TODO: watch canisterConfig
  }, [isConnected])

  return [
    canister,
    {
      error: undefined,
      // TODO: ?
      loading: !canister,
      idl: canisterConfig.idlFactory,
    },
  ]
}