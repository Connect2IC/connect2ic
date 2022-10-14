import { useEffect, useState } from "react"

// TODO: ??
// @ts-ignore
export const useCanisterSub = <T>(
  canister: any,
  options: { mode?: string } = {
    mode: "auto", // "anonymous" | "connected"
  },
) => {
  const [actor, setActor] = useState()

  useEffect(() => {
    const unsub = canister.get((result) => {
      if (result.isOk()) {
        setActor(result.value)
      }
      // TODO: error handling
    }, options)
    return unsub
  }, [canister])

  return [
    actor,
    {
      error: undefined,
      // TODO: ?
      loading: !actor,
    },
  ]
}