import {
  createMachine,
  assign,
  forwardTo,
  interpret, Interpreter,
} from "xstate"
import type { MachineConfig } from "xstate"
import { Actor, HttpAgent } from "@dfinity/agent"
import Emitter from "event-e3"
import type { ActorSubclass } from "@dfinity/agent"
import type { IDL } from "@dfinity/candid"
import type { CreateActorResult, IConnector, IWalletConnector } from "./providers/connectors"
import { ok, Result } from "neverthrow"
import { CreateActorError } from "./providers/connectors"

type Provider = IConnector

export type RootContext = {
  host: string
  dev: boolean
  autoConnect: boolean
  whitelist: Array<string>
  principal?: string
  activeProvider?: Provider
  providers: Array<Provider>
  connectingProvider?: string
  canisters: {
    [canisterName: string]: {
      canisterId: string
      idlFactory: IDL.InterfaceFactory
    }
  }
  actors: {
    [canisterName: string]: Result<ActorSubclass, { kind: CreateActorError }>
  }
  anonymousActors: {
    [canisterName: string]: Result<ActorSubclass, { kind: CreateActorError }>
  }
}


type DoneEvent = { type: "DONE", data: { providers: Array<Provider> } }
type DoneAndConnectedEvent = { type: "DONE_AND_CONNECTED", data: { activeProvider: Provider, providers: Array<Provider>, principal: string } }
type ConnectEvent = { type: "CONNECT", data: { provider: string } }
type CancelConnectEvent = { type: "CANCEL_CONNECT" }
type ConnectDoneEvent = { type: "CONNECT_DONE", data: { activeProvider: Provider, principal: string } }
type DisconnectEvent = { type: "DISCONNECT" }
type ErrorEvent = { type: "ERROR", data: { error: any } }
type CreateActorEvent = { type: "CREATE_ACTOR", data: { canisterName: string, canisterId: string, idlFactory: IDL.InterfaceFactory } }
type SaveActorEvent<Service> = { type: "SAVE_ACTOR", data: { actor: CreateActorResult<Service>, canisterName: string } }
type CreateAnonymousActorEvent = { type: "CREATE_ANONYMOUS_ACTOR", data: { canisterName: string, canisterId: string, idlFactory: IDL.InterfaceFactory } }
type SaveAnonymousActorEvent<Service> = { type: "SAVE_ANONYMOUS_ACTOR", data: { actor: CreateActorResult<Service>, canisterName: string } }

export type RootEvent<Service = any> =
  | DoneEvent
  | ConnectDoneEvent
  | DoneAndConnectedEvent
  | ConnectEvent
  | CancelConnectEvent
  | DisconnectEvent
  | ErrorEvent
  | CreateActorEvent
  | SaveActorEvent<Service>
  | CreateAnonymousActorEvent
  | SaveAnonymousActorEvent<Service>

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
        ERROR: {
          // ?
        },
      },
      invoke: {
        id: "init",
        src: (context, event) => async (callback, onReceive) => {
          const { providers } = context
          await Promise.all(providers.map(p => p.init()))
          let connectedProviders = providers.map(p => new Promise<Provider>(async (resolve, reject) => {
            const isConnected = await p.isConnected()
            isConnected ? resolve(p) : reject()
          }))
          // TODO: init failure
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
      on: {
        CONNECT: {
          // actions: forwardTo("connectService"),
          target: "connecting",
          // TODO: save connecting provider?
        },
      },
    },
    connecting: {
      entry: ["onConnecting"],
      on: {
        CONNECT: {
          // actions: forwardTo("connectService"),
          target: "connecting",
          // TODO: save connecting provider?
        },
        CANCEL_CONNECT: {
          target: "idle",
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
      invoke: {
        id: "connectService",
        // src: "connectService",
        src: (context, _event) => async (callback, onReceive) => {
          // onReceive(async (e) => {
          //   // TODO: Handle cancellation with AbortController?
          //   // if (e.type === "CONNECT") {
          //   // }
          // })
          if (_event.type !== "CONNECT") {
            return
          }
          const provider = context.providers.find(p => p.meta.id === _event.data.provider)
          console.log("find provider", provider)
          if (!provider) {
            callback({
              type: "ERROR",
              data: {
                error: "Provider not found",
              },
            })
            return
          }
          console.log("provider.connect")
          const result = await provider.connect()
          result.match(() => {
              callback({
                type: "CONNECT_DONE",
                data: {
                  activeProvider: provider,
                  principal: provider.principal!,
                },
              })
            },
            (e) => {
              callback({
                type: "ERROR",
                data: {
                  error: _event,
                },
              })
            },
          )
        },
        autoForward: true,
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

class Client {
  public _service: Interpreter<RootContext, any, RootEvent>
  public config
  private _emitter: Emitter

  constructor(service, emitter, config) {
    this._service = service
    this._emitter = emitter
    this.config = config
  }

  on(evt, fn) {
    this._emitter.on(evt, fn)
    return () => this._emitter.off(evt, fn) as void
  }

  subscribe(fn) {
    const sub = this._service.subscribe(fn)
    return sub.unsubscribe
  }

  connect(provider) {
    this._service.send({ type: "CONNECT", data: { provider } })
  }

  cancelConnect() {
    this._service.send({ type: "CANCEL_CONNECT" })
  }

  public disconnect() {
    this._service.send({ type: "DISCONNECT" })
  }

  public get providers() {
    return this._service.state.context.providers
  }

  public get activeProvider() {
    return this._service.state.context.activeProvider
  }

  public get principal() {
    return this._service.state.context.principal
  }

  public get actors() {
    return this._service.state.context.actors
  }

  public get anonymousActors() {
    return this._service.state.context.anonymousActors
  }

  public get status() {
    return this._service.state.value
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

  const agent = new HttpAgent({ host: config.host })
  if (config.dev) {
    // TODO: handle errors
    // try {
    agent.fetchRootKey().catch(e => console.error(e))
    // } catch (e) {
    //
    // }
  }
  const anonymousActors = Object.entries(canisters).map(([canisterName, val]) => {
    const { canisterId, idlFactory } = val
    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId,
    })
    return { actor, canisterName, idlFactory, canisterId }
  }).reduce((acc, { canisterName, actor }) => ({
    ...acc,
    [canisterName]: ok(actor),
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
            // TODO: why type error
            const result = await context.activeProvider!.createActor(e.data.canisterId, e.data.idlFactory)
            callback({ type: "SAVE_ACTOR", data: { actor: result, canisterName: e.data.canisterName } })
            // result.match(
            //   (actor) => {
            //     callback({ type: "SAVE_ACTOR", data: { actor: result, canisterName: e.data.canisterName } })
            //   },
            //   (error) => {
            //     // TODO: ?
            //     callback({ type: "ERROR", data: { error } })
            //   },
            // )
          }
        })
        // Initialize
        Object.keys(context.canisters).forEach(async (canisterName) => {
          const { canisterId, idlFactory } = context.canisters[canisterName]
          // TODO: why type error
          const result = await context.activeProvider!.createActor(canisterId, idlFactory)
          callback({ type: "SAVE_ACTOR", data: { actor: result, canisterName } })
        })
      },
    },
    actions: {
      onDisconnect: () => {
        emitter.emit("disconnect")
      },
      onInit: () => {
        emitter.emit("init")
      },
      onConnect: (context, event: ConnectEvent) => {
        emitter.emit("connect", event.data)
        // TODO: check if works
        return assign({
          connectingProvider: event.data,
        })
      },
      onConnecting: () => {
        emitter.emit("connecting")
      },
      onDisconnecting: () => {
        emitter.emit("disconnecting")
      },
    },
  })

  const service = interpret(rootMachine, { devTools: true })

  service.start()

  return new Client(service, emitter, config)
}

export type {
  Client,
}

export { createClient }
