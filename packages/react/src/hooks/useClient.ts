import { useContext } from "react"
import { Connect2ICContext } from "../context"

export const useClient = () => {
  const {
    client,
  } = useContext(Connect2ICContext)
  return client
}
