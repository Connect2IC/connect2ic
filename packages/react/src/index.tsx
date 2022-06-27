import { Connect2ICProvider, Connect2ICContext } from "./context"
import { createClient } from "@connect2ic/core/src"

export * from "./hooks"
export * from "./components"

type Client = ReturnType<typeof createClient>

export type {
  Client
}

export {
  Connect2ICProvider,
  Connect2ICContext,
}
