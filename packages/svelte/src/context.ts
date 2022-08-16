import type { Client } from "@connect2ic/core"
import type { Readable, Writable } from "svelte/store"

const contextKey = Symbol()

export { contextKey }

export type ContextState = {
  client: Client
  dialog: {
    open: () => void
    close: () => void
    isOpen: Writable<boolean>
  }
}