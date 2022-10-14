import { useContext, useEffect, useMemo, useState } from "react"
import { Token } from "@connect2ic/core"
import type { InternalTokenMethods } from "@connect2ic/core"
import { useCanisterAdvanced } from "./useCanisterAdvanced"

export const useToken = ({
                           canisterId,
                           standard,
                           network,
                         }, options = {}) => {
  const idlFactory = Token.getIdl(standard)
  const methods = Token.getMethods(standard)
  const [tokenActor, info] = useCanisterAdvanced({
    canisterId,
    // @ts-ignore
    idlFactory,
    // TODO: network switching
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