import { useContext, useEffect, useState } from "react"
import { useSelector } from "@xstate/react"
import { useConnect } from "./useConnect"
import { ConnectContext } from "../context"

export const useCanister = (
  canisterName,
  // TODO:
  options = {
    mode: "auto", // "anonymous" | "authenticated"
  },
) => {
  // TODO: support lazy loading canisters?
  const [canister, setCanister] = useState()
  const { canisters, connectService } = useContext(ConnectContext)
  const { status } = useConnect({
    onConnect: async ({ provider }) => {
      // TODO: save in machine? not context
      const { canisterId, idlFactory } = canisters[canisterName]
      connectService.send({ type: "CREATE_ACTOR", canisterId, idlFactory, canisterName })
    },
  })
  const anonymousActor = useSelector(connectService, (state) => state.context.anonymousCanisters[canisterName])
  const actor = useSelector(connectService, (state) => state.context.canisters[canisterName])
  const initialized = useSelector(connectService, (state) => !!state.value?.idle)
  // TODO: whitelist + host selector instead?

  useEffect(() => {
    if (!initialized) {
      return
    }
    // TODO: throw if invalid canisterName?
    const { canisterId, idlFactory } = canisters[canisterName]
    connectService.send({ type: "CREATE_ANONYMOUS_ACTOR", canisterId, idlFactory, canisterName })
  }, [canisterName, initialized])

  // TODO: move inside machine?
  useEffect(() => {
    if (actor) {
      setCanister(actor)
      return
    }
    if (anonymousActor) {
      setCanister(anonymousActor)
    }
  }, [anonymousActor, actor])

  // TODO:
  const loading = !canister
  const error = false

  return [canister, { error, loading }]
}