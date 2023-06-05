import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import { Connect2ICContext } from "../context"
// TODO: useCanister instead
import { CapRoot, CapRouter } from "cap-js-without-npm-registry"

export const useCapRouter = () => {
  const { capRouterId } = useContext(Connect2ICContext)
  return useQuery({
    queryKey: ["capRouter"],
    enabled: !!capRouterId,
    queryFn: () => {
      const capRouter = CapRouter.init({
        // TODO: get settings
        // host: window.location.origin,
        canisterId: capRouterId,
      })
      return capRouter
    },
  })
}
export const useCapRoot = (canisterId) => {
  const { data: capRouter } = useCapRouter()
  return useQuery({
    queryKey: ["capRoot", canisterId],
    enabled: !!capRouter,
    queryFn: () => CapRoot.init({
      tokenId: canisterId,
      router: capRouter,
      // host: window.location.origin,
    }),
  })
}

