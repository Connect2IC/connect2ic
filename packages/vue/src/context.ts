import type { InjectionKey, Ref } from "vue"
import type { Interpreter } from "xstate"
import type { RootContext, RootEvent } from "@connect2ic/core"
import type { IDL } from "@dfinity/candid"

type CanisterMap = {
  [canisterName: string]: {
    canisterId: string,
    idlFactory: IDL.InterfaceFactory,
  }
}

export type ContextState = {
  connectService: Interpreter<RootContext, any, RootEvent, any, any>
  dialog: {
    open: () => void
    close: () => void
    isOpen: Ref<boolean>
  }
  action: Ref<{ type: string, event: RootEvent, context: RootContext } | undefined>
  canisters: Ref<CanisterMap>
}

const contextKey: InjectionKey<ContextState> = Symbol()

export { contextKey }
