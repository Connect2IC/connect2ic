<script lang="ts">
  import { connectMachine } from "@connect2ic/core"
  import type { RootContext, RootEvent, ProviderOptions } from "@connect2ic/core"
  import type { State } from "xstate"
  import { contextKey } from "./context.ts"
  import type { ContextState } from "./context.ts"
  import { setContext } from "svelte"
  import { readable, writable } from "svelte/store"
  import type { Readable } from "svelte/store"
  import { useMachine } from "@xstate/svelte"
  import type { Interpreter } from "xstate"
  import type { IDL } from "@dfinity/candid"

  type CanisterMap = {
    [canisterName: string]: {
      canisterId: string,
      idlFactory: IDL.InterfaceFactory,
    }
  }

  export let canisters: CanisterMap  = {}
  export let whitelist: Array<string>= undefined
  export let host:string = undefined
  export let dev: boolean = false
  export let providers: Array<ProviderOptions> = []
  export let autoConnect: boolean = true

  const { state: connectState, send, service: connectService }: {
    state: Readable<State<RootContext, RootEvent>>
    service: Interpreter<RootContext, any, RootEvent, any, any>
  } = useMachine<RootContext, RootEvent>(connectMachine, {
    devTools: true,
    actions: {
      onConnect: (context, event) => {
        Object.entries(canisters).forEach(([canisterName, val]) => {
          const { canisterId, idlFactory } = val
          send({ type: "CREATE_ACTOR", data: { canisterId, idlFactory, canisterName } })
        })
        action.set({ type: "onConnect", context, event })
      },
      onDisconnect: (context, event) => {
        action.set({ type: "onDisconnect", context, event })
      },
      onInit: (context, event) => {
        Object.entries(canisters).forEach(([canisterName, val]) => {
          const { canisterId, idlFactory } = val
          send({ type: "CREATE_ANONYMOUS_ACTOR", data: { canisterId, idlFactory, canisterName } })
        })
      },
    },
  })
  // const connectService = interpret<RootContext, any, RootEvent>(connectMachine, {
  //   devTools: true,
  //   actions: {
  //     onConnect: (context, event) => {
  //       Object.entries(canisters).forEach(([canisterName, val]) => {
  //         const { canisterId, idlFactory } = val
  //         connectService.send({ type: "CREATE_ACTOR", data: { canisterId, idlFactory, canisterName } })
  //       })
  //       action.set({ type: "onConnect", context, event })
  //     },
  //     onDisconnect: (context, event) => {
  //       action.set({ type: "onDisconnect", context, event })
  //     },
  //     onInit: (context, event) => {
  //       Object.entries(canisters).forEach(([canisterName, val]) => {
  //         const { canisterId, idlFactory } = val
  //         connectService.send({ type: "CREATE_ANONYMOUS_ACTOR", data: { canisterId, idlFactory, canisterName } })
  //       })
  //     },
  //   },
  // }).start()

  let open = writable(false)
  const dialog = {
    open: () => {
      $open = true
    },
    close: () => {
      $open = false
    },
    isOpen: open,
  }
  let action = writable<{ type: string, context: RootContext, event: RootEvent }>(undefined)

  setContext<ContextState>(contextKey, {
    dialog,
    action,
    // TODO: ?
    canisters: readable(canisters),
    connectService,
    connectState,
  })

  connectService.send({
    type: "INIT",
    data: {
      dev,
      whitelist: whitelist ?? Object.values(canisters).map(canister => (canister as any).canisterId),
      host,
      providers,
      autoConnect,
    },
  })
</script>
<slot></slot>