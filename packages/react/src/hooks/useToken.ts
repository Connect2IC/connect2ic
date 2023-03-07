import { useContext, useEffect, useState } from "react"
import { TokenStandards, TOKEN } from "@connect2ic/core"
import { useConnect } from "./useConnect"
import { useCanister } from "./useCanister"
import { Connect2ICContext } from "../context"

type TokenName = "origyn" | "xtc" | "wicp" | "icp"

type NFTOptions = {
  network?: string
  canisterId: string
  standard: string
  mode?: string
} | {
  // TODO: just use nft name for convenience?
  name: string
}

export const useToken = (options: NFTOptions) => {
  const {
    // TODO: ?
    canisterId,
    standard = TOKEN.icrc1,
    network = "ic",
    mode = "auto",
  } = options
  // TODO: how?
  const { capRouterId } = useContext(Connect2ICContext)
  const { IDL, Wrapper } = TokenStandards[standard]
  const { principal } = useConnect()
  const [actor, info] = useCanister({
    canisterId,
    idlFactory: IDL.idlFactory,
    // TODO: network switching
    network,
    mode,
  })
  // const wrapper = useMemo(() => {
  //   if (!actor) {
  //     return
  //   }
  //   return new Wrapper.default(actor, canisterId, capRouter)
  // }, [actor, canisterId])
  const [wrapper, setWrapper] = useState<any>()

  useEffect(() => {
    if (!actor) {
      return
    }
    ;(async () => {
      const wrapperResult = new Wrapper.default(actor, canisterId)
      await wrapperResult.init({ capRouterId })
      setWrapper(wrapperResult)
    })()
  }, [actor, canisterId])

  return [
    wrapper,
    {
      ...info,
    },
  ] as const
}
