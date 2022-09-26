import {
  createMachine,
  assign,
  interpret, Interpreter,
} from "xstate"
import type { MachineConfig } from "xstate"
import Emitter from "event-e3"
import type { IDL } from "@dfinity/candid"
import type { CreateActorResult, IConnector } from "./providers/connectors"
import { Anonymous } from "./providers"
import { assign as assignImmer } from "@xstate/immer"

type Provider = IConnector

export type RootContext = {
  autoConnect: boolean
  preferredNetwork: string
  networksConfig: ClientOptions["networks"]
  // config: {
  //   local: {
  //     host: string
  //     whitelist: Array<string>
  //     principal?: string
  //   }
  //   ic: {
  //     host: string
  //     whitelist: Array<string>
  //     principal?: string
  //   }
  // }
  connectingProvider?: string
  activeProvider?: Provider
  networks: {
    [networkName: string]: {
      providers: {
        [providerId: string]: {
          connector: Provider
          canisters: {
            [canisterId: string]: {
              actor: CreateActorResult<any>
              canisterName: string
              idlFactory: IDL.InterfaceFactory
            }
          }
        }
      }
      anonymousProvider: {
        connector: Provider
        canisters: {
          [canisterId: string]: {
            actor: CreateActorResult<any>
            canisterName: string
            idlFactory: IDL.InterfaceFactory
          }
        }
      }
    }
  }
  // canisters: {
  //   [providerId: string]: {
  //     local: {
  //       [canisterId: string]: {
  //         actor: CreateActorResult<any>
  //         canisterName: string
  //         idlFactory: IDL.InterfaceFactory
  //       }
  //     }
  //     ic: {
  //       [canisterId: string]: {
  //         actor: CreateActorResult<any>
  //         canisterName: string
  //         idlFactory: IDL.InterfaceFactory
  //       }
  //     }
  //   }
  // }
}


type DoneEvent = {
  type: "DONE",
  data: {}
}

type DoneAndConnectedEvent = {
  type: "DONE_AND_CONNECTED",
  data: {
    activeProvider: Provider
  }
}
type ConnectEvent = { type: "CONNECT", data: { provider: string } }
type CancelConnectEvent = { type: "CANCEL_CONNECT" }
type ConnectDoneEvent = { type: "CONNECT_DONE", data: { activeProvider: Provider } }
type DisconnectEvent = { type: "DISCONNECT" }
type ErrorEvent = { type: "ERROR", data: { error: any } }
type CreateActorEvent = {
  type: "CREATE_ACTOR", data: {
    [network: string]: {
      canisterName: string,
      canisterId: string,
      idlFactory: IDL.InterfaceFactory
    }
  }
}
type SaveActorEvent<Service> = {
  type: "SAVE_ACTOR",
  data: {
    providerId: string
    networkName: string
    canisterId: string
    actor: CreateActorResult<Service>
    canisterName: string,
    idlFactory: IDL.InterfaceFactory
  }
}
type CreateAnonymousActorEvent = { type: "CREATE_ANONYMOUS_ACTOR", data: { canisterName: string, canisterId: string, idlFactory: IDL.InterfaceFactory } }
type SaveAnonymousActorEvent<Service> = {
  type: "SAVE_ANONYMOUS_ACTOR",
  data: {
    canisterId: string
    networkName: string
    actor: CreateActorResult<Service>,
    canisterName: string
    idlFactory: IDL.InterfaceFactory
  }
}

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

const saveAnonymousActor = assignImmer((context: RootContext, event: SaveAnonymousActorEvent<any>) => {
  const { networkName, canisterName, canisterId, actor, idlFactory } = event.data
  // TODO: normalize?
  context.networks[networkName].anonymousProvider.canisters = {
    ...context.networks[networkName].anonymousProvider.canisters,
    [canisterId]: {
      canisterName,
      actor,
      idlFactory,
    },
  }
})

const saveActor = assignImmer((context: RootContext, event: SaveActorEvent<any>) => {
  const { providerId, networkName, canisterName, canisterId, actor, idlFactory } = event.data
  // TODO: normalize?
  context.networks[networkName].providers[providerId].canisters = {
    ...context.networks[networkName].providers[providerId].canisters,
    [canisterId]: {
      canisterName,
      actor,
      idlFactory,
    },
  }
})

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
          actions: [],
        },
        DONE_AND_CONNECTED: {
          target: "connected",
          actions: [assignImmer((context, event) => {
            context.activeProvider = event.data.activeProvider
          })],
        },
        ERROR: {
          // ?
        },
        SAVE_ANONYMOUS_ACTOR: {
          actions: [saveAnonymousActor],
        },
      },
      invoke: {
        id: "init",
        src: (context, event) => async (callback, onReceive) => {
          const { networks, preferredNetwork, networksConfig } = context
          const { anonymousProvider, providers } = networks[preferredNetwork]

          await Promise.all([
            ...Object.values(providers).map(p => p.connector.init()),
            anonymousProvider.connector.init(),
          ])

          Object.keys(networksConfig).forEach(networkName => {
            const network = networksConfig[networkName]
            Object.entries(network.canisters ?? {}).forEach(async ([canisterName, val]) => {
              const { canisterId, idlFactory } = val
              const actor = await anonymousProvider.connector.createActor(canisterId, idlFactory)
              callback({
                type: "SAVE_ANONYMOUS_ACTOR",
                data: {
                  canisterId,
                  networkName,
                  canisterName,
                  actor,
                  idlFactory,
                },
              })
            })
          })

          let connectedProviders = Object.values(providers).map(p => new Promise<Provider>(async (resolve, reject) => {
            const isConnected = await p.connector.isConnected()
            isConnected ? resolve(p.connector) : reject()
          }))

          // // TODO: create canisters
          // Object.keys(networksConfig).forEach(networkName => {
          //   const network = networksConfig[networkName]
          //   Object.entries(network.canisters ?? {}).forEach(async ([canisterName, val]) => {
          //     const { canisterId, idlFactory } = val
          //     const actor = await anonymousProvider.connector.createActor(canisterId, idlFactory)
          //     callback({
          //       type: "SAVE_ANONYMOUS_ACTOR",
          //       data: {
          //         canisterId,
          //         networkName,
          //         canisterName,
          //         actor,
          //         idlFactory,
          //       },
          //     })
          //   })
          // })

          // TODO: init failure
          Promise.any(connectedProviders).then((connectedProvider) => {
            callback({
              type: "DONE_AND_CONNECTED",
              data: {
                activeProvider: connectedProvider,
              },
            })
          }).catch(e => {
            callback({
              type: "DONE",
              data: {},
            })
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
        SAVE_ANONYMOUS_ACTOR: {
          actions: [saveAnonymousActor],
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
        SAVE_ANONYMOUS_ACTOR: {
          actions: [saveAnonymousActor],
        },
      },
      invoke: {
        id: "connectService",
        // src: "connectService",
        src: (context, _event) => async (callback, onReceive) => {
          //   // TODO: Handle cancellation with AbortController?
          if (_event.type !== "CONNECT") {
            return
          }
          const provider = context.networks[context.preferredNetwork].providers[_event.data.provider]
          if (!provider) {
            callback({
              type: "ERROR",
              data: {
                error: "Provider not found",
              },
            })
            return
          }
          const result = await provider.connector.connect()
          result.match(() => {
              callback({
                type: "CONNECT_DONE",
                data: {
                  activeProvider: provider.connector,
                },
              })
            },
            (e) => {
              console.error(e)
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
        src: (context, _event) => (callback, onReceive) => {
          onReceive(async (e: RootEvent) => {
            if (e.type === "CREATE_ACTOR") {
              for (const networkName of Object.keys(e.data)) {
                const { canisterId, idlFactory, canisterName } = e.data[networkName]
                // TODO: why type error
                const actor = await context.activeProvider!.createActor(canisterId, idlFactory)
                callback({
                  type: "SAVE_ACTOR",
                  data: {
                    providerId: context.activeProvider!.meta.id,
                    networkName,
                    canisterId,
                    actor,
                    canisterName,
                    idlFactory,
                  },
                })
              }
            }
          })
          if (!context.activeProvider) {
            return
          }
          // Initialize
          Object.keys(context.networksConfig).forEach((networkName) => {
            const networkConfig = context.networksConfig[networkName]
            Object.keys(networkConfig.canisters ?? {}).forEach(async (canisterName) => {
              const { canisterId, idlFactory } = networkConfig.canisters![canisterName]
              const actor = await context.activeProvider!.createActor(canisterId, idlFactory)
              callback({
                type: "SAVE_ACTOR",
                data: {
                  providerId: context.activeProvider!.meta.id,
                  networkName,
                  canisterId,
                  actor,
                  canisterName,
                  idlFactory,
                },
              })
            })
          })
        },
        autoForward: true,
      },
      on: {
        DISCONNECT: {
          target: "disconnecting",
          // TODO: pass provider?
        },
        SAVE_ACTOR: {
          actions: [saveActor],
        },
        SAVE_ANONYMOUS_ACTOR: {
          actions: [saveAnonymousActor],
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
  autoConnect?: boolean
  providerUrl?: string
  ledgerCanisterId?: string
  ledgerHost?: string
  appName?: string
}

type NetworkConfig = {
  canisters?: {
    [canisterName: string]: {
      canisterId: string
      idlFactory: IDL.InterfaceFactory
    }
  }
  providers: Array<Provider> | ((config: Config) => Array<Provider>)
  providerConfig?: {
    whitelist?: Array<string>
    host?: string
    autoConnect?: boolean
    ledgerCanisterId?: string
    ledgerHost?: string
    appName?: string
  }
}

type ClientOptions = {
  preferredNetwork?: string
  networks: {
    [networkName: string]: NetworkConfig
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

  public createActor(data) {
    this._service.send({ type: "CREATE_ACTOR", data })
  }

  public createAnonymousActor(data) {
    this._service.send({ type: "CREATE_ANONYMOUS_ACTOR", data })
  }

  public get providers() {
    return this._service.state.context[this._service.state.context.preferredNetwork].providers
  }

  public get activeProvider() {
    return this._service.state.context[this._service.state.context.preferredNetwork].activeProvider
  }

  public get anonymousProvider() {
    return this._service.state.context.networks[this._service.state.context.preferredNetwork].anonymousProvider
  }

  public get status() {
    return this._service.state.value
  }
}

const createClient = ({
                        networks = {},
                        preferredNetwork = "local",
                      }: ClientOptions) => {

  const defaults = {
    ic: {
      providerConfig: {
        host: "https://ic0.app",
      },
      providers: [],
      canisters: {},
    },
    local: {
      providerConfig: {
        host: window.location.origin,
      },
      providers: [],
      canisters: {},
    },
  }

  const networksConfig: ClientOptions["networks"] = {
    ...Object.keys(networks).reduce((acc, networkName) => ({
      ...acc,
      [networkName]: {
        ...defaults[networkName],
        ...networks[networkName],
        providerConfig: {
          ...defaults[networkName].providerConfig,
          ...networks[networkName].providerConfig,
          whitelist: Object.values(networks[networkName].canisters ?? {}).map(canister => (canister as {
            canisterId: string
            idlFactory: IDL.InterfaceFactory
          }).canisterId),
        },
      },
    }), {}),
  }

  console.log(networksConfig)

  const emitter = new Emitter()

  const rootMachine = createMachine<RootContext, RootEvent>({
    id: "root",
    initial: "idle",
    context: {
      // TODO: move to config?
      autoConnect: true,
      preferredNetwork,
      activeProvider: undefined,
      networksConfig,
      networks: Object.keys(networksConfig).reduce((acc, networkName) => {
        const networkConfig = networksConfig[networkName]
        const providers =
          typeof networkConfig.providers === "function"
            ? networkConfig.providers(networkConfig.providerConfig ?? {})
            : networkConfig.providers
        providers?.forEach(p => p.config = networkConfig.providerConfig)

        return {
          ...acc,
          [networkName]: {
            ...networkConfig,
            anonymousProvider: {
              connector: new Anonymous(networkConfig.providerConfig),
              // TODO: init?
              canisters: {},
            },
            providers: providers?.reduce((acc, provider) => ({
              ...acc,
              [provider.meta.id]: {
                connector: provider,
                canisters: {},
              },
            }), {}) ?? {},
          },
        }
      }, {}),
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

  return new Client(service, emitter, networksConfig)
}

export type {
  Client,
}

export { createClient }
