import {
  createMachine,
  assign,
  forwardTo,
  interpret,
} from "xstate"
import type { MachineConfig } from "xstate"
import { Actor, HttpAgent } from "@dfinity/agent"
import Emitter from "event-e3"
import type { ActorSubclass } from "@dfinity/agent"
// import type { ProviderOptions } from "../providers/index"
import type { IDL } from "@dfinity/candid"
import type { IConnector, IWalletConnector } from "../providers/connectors"

type Provider = IConnector & Partial<IWalletConnector>

export type RootContext = {
  host: string
  dev: boolean
  autoConnect: boolean
  whitelist: Array<string>
  principal?: string
  activeProvider?: Provider
  providers: Array<Provider>
  canisters: any
  actors: {
    [canisterName: string]: ActorSubclass
  }
  anonymousActors: {
    [canisterName: string]: ActorSubclass
  }
}


type InitEvent = {
  type: "INIT",
  data: {
    whitelist: Array<string>
    host?: string,
    providers: Array<Provider>
    dev?: boolean,
    autoConnect?: boolean,
  }
}
type DoneEvent = { type: "DONE", data: { providers: Array<Provider> } }
type DoneAndConnectedEvent = { type: "DONE_AND_CONNECTED", data: { activeProvider: Provider, providers: Array<Provider>, principal: string } }
type ConnectEvent = { type: "CONNECT", data: { provider: string } }
type ConnectDoneEvent = { type: "CONNECT_DONE", data: { activeProvider: Provider, principal: string } }
type DisconnectEvent = { type: "DISCONNECT" }
type ErrorEvent = { type: "ERROR", data: { error: any } }
type CreateActorEvent = { type: "CREATE_ACTOR", data: { canisterName: string, canisterId: string, idlFactory: IDL.InterfaceFactory } }
type SaveActorEvent = { type: "SAVE_ACTOR", data: { actor: ActorSubclass, canisterName: string } }
type CreateAnonymousActorEvent = { type: "CREATE_ANONYMOUS_ACTOR", data: { canisterName: string, canisterId: string, idlFactory: IDL.InterfaceFactory } }
type SaveAnonymousActorEvent = { type: "SAVE_ANONYMOUS_ACTOR", data: { actor: ActorSubclass, canisterName: string } }

export type RootEvent =
  | InitEvent
  | DoneEvent
  | ConnectDoneEvent
  | DoneAndConnectedEvent
  | ConnectEvent
  | DisconnectEvent
  | ErrorEvent
  | CreateActorEvent
  | SaveActorEvent
  | CreateAnonymousActorEvent
  | SaveAnonymousActorEvent

const authStates: MachineConfig<RootContext, any, RootEvent> = {
  id: "auth",
  initial: "initializing",
  schema: {
    context: {} as RootContext,
    events: {} as RootEvent,
  },
  states: {
    initializing: {
      on: {
        DONE: {
          target: "idle",
          actions: assign((context, event) => ({
            providers: event.data.providers,
          })),
        },
        DONE_AND_CONNECTED: {
          target: "connected",
          actions: [
            assign((context, event) => ({
              providers: event.data.providers,
              activeProvider: event.data.activeProvider,
              principal: event.data.principal,
            })),
          ],
        },
      },
      invoke: {
        id: "init",
        src: (context, event: InitEvent) => async (callback, onReceive) => {
          // TODO: clean up
          const { providers } = context
          await Promise.allSettled(providers.map(p => p.init()))
          let connectedProviders = providers.map(p => new Promise<Provider>(async (resolve, reject) => {
            const isConnected = await p.isConnected()
            isConnected ? resolve(p) : reject()
          }))

          // TODO: split into 2?
          Promise.any(connectedProviders).then((connectedProvider) => {
            callback({
              type: "DONE_AND_CONNECTED",
              data: {
                providers,
                activeProvider: connectedProvider,
                principal: connectedProvider.principal!,
              },
            })
          }).catch(e => {
            callback({ type: "DONE", data: { providers } })
          })
        },
      },
      exit: ["onInit"],
    },
    idle: {
      invoke: {
        id: "connectService",
        autoForward: true,
        src: (context, _event) => (callback, onReceive) => {
          onReceive(async (e) => {
            // TODO: Handle cancellation with AbortController?
            const provider = context.providers.find(p => p.meta.id === e.data.provider)
            if (e.type === "CONNECT") {
              const connected = await provider.connect()
              if (connected) {
                callback({
                  type: "CONNECT_DONE",
                  // TODO: fix?
                  data: {
                    activeProvider: provider,
                    principal: provider.principal,
                  },
                })
              } else {
                callback({
                  type: "ERROR",
                  data: {
                    error: e,
                  },
                })
              }
            }
          })
        },
      },
      on: {
        CONNECT: {
          actions: forwardTo("connectService"),
        },
        CONNECT_DONE: {
          target: "connected",
          actions: [
            assign((context, event) => ({
              activeProvider: event.data.activeProvider,
              principal: event.data.principal,
            })),
          ],
        },
        ERROR: {
          // actions: assign((context, event) => {
          //   return ({
          //     provider: event.data.provider,
          //     principal: event.data.principal,
          //   })
          // }),
        },
      },
    },
    connected: {
      entry: ["onConnect"],
      invoke: {
        id: "actorService",
        src: "actorService",
        autoForward: true,
      },
      on: {
        DISCONNECT: {
          target: "disconnecting",
          // TODO: pass provider?
        },
        SAVE_ACTOR: {
          actions: assign((context, event) => ({
            actors: { ...context.actors, [event.data.canisterName]: event.data.actor },
          })),
        },
      },
    },
    disconnecting: {
      invoke: {
        id: "disconnect",
        src: (context, event) => async () => {
          await context.activeProvider?.disconnect()
        },
        onDone: {
          target: "idle",
          // TODO: empty context
          actions: [
            assign((context, event) => ({
              activeProvider: undefined,
              actors: {},
              principal: undefined,
            })),
            "onDisconnect",
          ],
        },
        onError: {
          target: "connected",
          actions: [],
        },
      },
    },
  },
}

type Config = {
  whitelist?: Array<string>
  host?: string
  dev?: boolean
  autoConnect?: boolean
  providerUrl?: string
  ledgerCanisterId?: string
  ledgerHost?: string
  appName?: string
}

type ClientOptions = {
  providers: Array<Provider> | ((config: Config) => Array<Provider>)
  canisters?: {
    [canisterName: string]: {
      canisterId: string
      idlFactory: IDL.InterfaceFactory
    }
  }
  globalProviderConfig?: {
    whitelist?: Array<string>
    host?: string
    dev?: boolean
    autoConnect?: boolean
    ledgerCanisterId?: string
    ledgerHost?: string
    appName?: string
  }
}

const createClient = ({
                        canisters = {},
                        providers: p = [],
                        globalProviderConfig = {},
                      }: ClientOptions) => {
  const config = {
    dev: true,
    autoConnect: true,
    host: window.location.origin,
    whitelist: Object.values(canisters).map(canister => (canister as {
      canisterId: string
      idlFactory: IDL.InterfaceFactory
    }).canisterId),
    ...globalProviderConfig,
  }
  const providers = typeof p === "function" ? p(config) : p

  providers.forEach(p => p.config = config)

  const anonymousActors = Object.entries(canisters).map(([canisterName, val]) => {
    const { canisterId, idlFactory } = val
    const agent = new HttpAgent({ host: config.host })
    // Fetch root key for certificate validation during development
    if (config.dev) {
      agent.fetchRootKey().catch(err => {
        console.warn("Unable to fetch root key. Check to ensure that your local replica is running")
        console.error(err)
      })
    }
    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId,
    })
    return { actor, canisterName, idlFactory, canisterId }
  }).reduce((acc, { canisterName, actor }) => ({
    ...acc,
    [canisterName]: actor,
  }), {})

  const emitter = new Emitter()

  const rootMachine = createMachine<RootContext, RootEvent>({
    id: "root",
    initial: "idle",
    context: {
      ...config,
      providers,
      anonymousActors,
      canisters,
      actors: {},
      principal: undefined,
      activeProvider: undefined,
    },
    schema: {
      context: {} as RootContext,
      events: {} as RootEvent,
    },
    states: {
      idle: {
        ...authStates,
      },
    },
  }, {
    services: {
      actorService: (context, _event) => (callback, onReceive) => {
        onReceive(async (e: RootEvent) => {
          if (e.type === "CREATE_ACTOR") {
            const actor = (await context.activeProvider.createActor(e.data.canisterId, e.data.idlFactory) as ActorSubclass)
            callback({ type: "SAVE_ACTOR", data: { actor, canisterName: e.data.canisterName } })
          }
        })
        Object.entries(context.canisters).forEach(async ([canisterName, val]) => {
          const { canisterId, idlFactory } = val
          const actor = (await context.activeProvider.createActor(canisterId, idlFactory) as ActorSubclass)
          callback({ type: "SAVE_ACTOR", data: { actor, canisterName } })
        })
      },
    },
    actions: {
      onDisconnect: (context, event) => {
        emitter.emit("disconnect")
      },
      onInit: (context, event) => {
        emitter.emit("init")
      },
      onConnect: (context, event) => {
        emitter.emit("connect", event.data)
      },
    },
  })

  const service = interpret(rootMachine, { devTools: true })

  service.start()

  return {
    _service: service,
    on: (evt, fn) => {
      emitter.on(evt, fn)
      return () => emitter.off(evt, fn)
    },
    subscribe: (fn) => {
      const sub = service.subscribe(fn)
      return sub.unsubscribe
    },
    connect: (provider) => {
      service.send({ type: "CONNECT", data: { provider } })
    },
    disconnect: () => {
      service.send({ type: "DISCONNECT" })
    },
    get providers() {
      return service.state.context.providers
    },
    get activeProvider() {
      return service.state.context.activeProvider
    },
    get principal() {
      return service.state.context.principal
    },
    get actors() {
      return service.state.context.actors
    },
    get anonymousActors() {
      return service.state.context.anonymousActors
    },
    get status() {
      return service.state.value.idle
    },
    get config() {
      return config
    },
  }
}

export { createClient }
