import { useContext, useEffect } from "react"
import { useSelector } from "@xstate/react"
import { Connect2ICContext } from "../context"

export const useProviders = () => {
  const { connectService } = useContext(Connect2ICContext)
  const providers = useSelector(connectService, (state) => state.context.providers)

  return providers ?? []
}