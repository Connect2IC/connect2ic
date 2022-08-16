import { useContext } from "react"
import { Connect2ICContext } from "../context"
import { Client } from "@connect2ic/core"

export const useClient = (): Client => {
  const {
    client,
  } = useContext(Connect2ICContext)
  return client
}
