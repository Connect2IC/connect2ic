import { useContext, useEffect, useState } from "react"
import { useSelector } from "@xstate/react"
import { useConnect } from "./useConnect"
import { Connect2ICContext } from "../context"

export const useCanister = (
  canisterName,
  options = {
    mode: "auto", // "anonymous" | "authenticated"
  },
) => {
  const { mode } = options
  // TODO: support lazy loading canisters?
  const [canister, setCanister] = useState()
  const { canisters, connectService } = useContext(Connect2ICContext)
  const { status } = useConnect({
    onConnect: async () => {
      // TODO: save in machine? not context
      const { canisterId, idlFactory } = canisters[canisterName]
      connectService.send({ type: "CREATE_ACTOR", data: { canisterId, idlFactory, canisterName } })
    },
    onDisconnect: async () => {
      if (anonymousActor) {
        setCanister(anonymousActor)
      }
    },
  })
  const anonymousActor = useSelector(connectService, (state) => state.context.anonymousActors[canisterName])
  const actor = useSelector(connectService, (state) => state.context.actors[canisterName])
  const initialized = useSelector(connectService, (state) => !!state.value?.idle)

  useEffect(() => {
    if (!initialized) {
      return
    }
    // TODO: throw if invalid canisterName?
    const { canisterId, idlFactory } = canisters[canisterName]
    connectService.send({ type: "CREATE_ANONYMOUS_ACTOR", data: { canisterId, idlFactory, canisterName } })
  }, [canisterName, initialized])

  // TODO: move inside machine?
  useEffect(() => {
    // if logged out
    if (actor && mode !== "anonymous") {
      setCanister(actor)
      return
    }
    if (anonymousActor) {
      setCanister(anonymousActor)
    }
  }, [anonymousActor, actor, mode])

  // TODO:
  const loading = !canister
  const error = false

  return [canister, { error, loading }]
}