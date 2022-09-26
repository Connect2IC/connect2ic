import { useContext, useEffect, useMemo, useState } from "react"
import { useSelector } from "@xstate/react"
import { useConnect } from "./useConnect"
import { Connect2ICContext } from "../context"
import type { ActorSubclass, Actor } from "@dfinity/agent"
import { IDL } from "@dfinity/candid"
import { getIdl, getMethods } from "@connect2ic/core"
import { useCanister } from "./useCanister"
import type { InternalTokenMethods } from "@connect2ic/core"
import { useCanisterAdvanced } from "./useCanisterAdvanced"

export const useToken = ({
                           canisterId,
                           standard,
                           network,
                         }, options = {}) => {
  const { client } = useContext(Connect2ICContext)
  const idlFactory = getIdl(standard)
  const methods = getMethods(standard)
  const [tokenActor, info] = useCanisterAdvanced({
    canisterId,
    // @ts-ignore
    idlFactory,
    // TODO: network switching. get from context?
    network: network ?? "ic",
  }, options)
  const wrappedTokenActor = useMemo(() => {
    if (!tokenActor) {
      return
    }
    return Object.keys(methods).reduce((acc, methodName) => ({
      ...acc,
      [methodName]: (...args) => methods[methodName](tokenActor, args),
    }), {}) as InternalTokenMethods
  }, [tokenActor])

  return [
    wrappedTokenActor,
    info,
  ] as const
}