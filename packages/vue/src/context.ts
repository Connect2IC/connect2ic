import type { InjectionKey, Ref } from "vue"
import type { createClient } from "@connect2ic/core"

export type ContextState = {
  client: ReturnType<typeof createClient>
  dialog: {
    open: () => void
    close: () => void
    isOpen: Ref<boolean>
  }
}

const contextKey: InjectionKey<ContextState> = Symbol()

export { contextKey }
