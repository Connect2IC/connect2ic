import { useContext } from "react"
import { Connect2ICContext } from "../context"
import { createClient } from "@connect2ic/core"

export const useClient = (): ReturnType<typeof createClient> => {
  const {
    client,
  } = useContext(Connect2ICContext)
  return client
}
