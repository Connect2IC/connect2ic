import { useContext, useEffect, useMemo, useState } from "react"
import { NFTStandards } from "@connect2ic/core"
import { useCanister } from "./useCanister"
import { useConnect } from "./useConnect"

type NFTName = "icpunks" | "crowns"

type NFTOptions = {
  network?: string
  canisterId: string
  standard: string
  mode?: string
} | {
  // TODO: just use nft name for convenience?
  name: string
}

export const useNFT = (options: NFTOptions) => {
  const {
    // TODO: ?
    canisterId,
    standard = "DIP721v2",
    network = "ic",
    mode = "auto",
  } = options
  const { IDL: idlFactory, Wrapper } = NFTStandards[standard]
  const { principal } = useConnect()
  const [actor, info] = useCanister({
    canisterId,
    idlFactory: idlFactory.default,
    // TODO: network switching
    network,
    mode,
  })
  const wrapper = useMemo(() => {
    if (!actor) {
      return
    }
    return new Wrapper.default(actor, canisterId)
  }, [actor, canisterId])

  return [
    wrapper,
    {
      ...info,
    },
  ] as const
}
