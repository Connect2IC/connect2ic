import type { Interpreter, State } from "xstate"
import type { RootContext, RootEvent } from "@connect2ic/core"
import type { IDL } from "@dfinity/candid"
import type { Readable, Writable } from "svelte/store"

const contextKey = Symbol()

export { contextKey }

type CanisterMap = {
  [canisterName: string]: {
    canisterId: string,
    idlFactory: IDL.InterfaceFactory,
  }
}

export type ContextState = {
  connectService: Interpreter<RootContext, any, RootEvent, any, any>
  connectState: Readable<State<RootContext, RootEvent>>
  dialog: {
    open: () => void
    close: () => void
    isOpen: Writable<boolean>
  }
  action?: Writable<{ type: string, event: RootEvent, context: RootContext }>
  canisters: Readable<CanisterMap>
}