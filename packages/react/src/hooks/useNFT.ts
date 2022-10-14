import { useContext, useEffect, useMemo, useState } from "react"
import { NFTStandards } from "@connect2ic/core"
import type { InternalTokenMethods } from "@connect2ic/core"
import { useCanisterAdvanced } from "./useCanisterAdvanced"
import { useCanisterSub } from "./useCanisterSub"

export const useNFT = (options, canisterOptions = {}) => {
  const {
    // TODO: ?
    canisterId,
    standard,
    canister,
    network = "local",
  } = options
  const { IDL: idlFactory, Wrapper } = NFTStandards[standard]
  const [actor] = useCanisterSub(canister)
  // const [tokenActor, info] = useCanisterAdvanced({
  //   canisterId,
  //   idlFactory: idlFactory.default,
  //   // TODO: network switching
  //   network,
  // }, canisterOptions)

  const wrappedTokenActor = useMemo(() => {
    if (!actor) {
      return
    }
    return new Wrapper.default(actor, canister.canisterId)
  }, [actor, canisterId])

  return [
    wrappedTokenActor,
    // info,
  ] as const
}
