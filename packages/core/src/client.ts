import {
  createMachine,
  assign,
  interpret,
  Interpreter,
} from "xstate"
import type { MachineConfig } from "xstate"
import Emitter from "event-e3"
import type { IDL } from "@dfinity/candid"
import type { CreateActorResult, IConnector } from "./providers/connectors"
import { Anonymous } from "./providers"
import { assign as assignImmer } from "@xstate/immer"
import { NFTStandards } from "./tokens"

type Provider = IConnector

export type RootContext = {
  autoConnect: boolean
  preferredNetwork: string
  networksConfig: ClientOptions["networks"]
  // config: {
  //   local: {
  //     host: string
  //     whitelist: Array<string>
  //   }
  //   ic: {
  //     host: string
  //     whitelist: Array<string>
  //   }
  // }
  canisters: {
    [canisterName: string]: {
      [networkName: string]: {
        idlFactory: IDL.InterfaceFactory
        canisterId: string
      }
    }
  }
  anonymousActors: {
    [canisterName: string]: {
      [networkName: string]: {
        idlFactory: IDL.InterfaceFactory
        canisterId: string
        actor: CreateActorResult<any>
      }
    }
  }
  actors: {
    [canisterName: string]: {
      [networkName: string]: {
        idlFactory: IDL.InterfaceFactory
        canisterId: string
        actor: CreateActorResult<any>
      }
    }
  }
  connectingProvider?: Provider
  activeProvider?: Provider
  providers: {
    [networkName: string]: {
      [providerId: string]: Provider
    }
  }
  anonymousProviders: {
    [networkName: string]: {
      anonymous: Provider
    }
  }
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
  context.anonymousActors[canisterName] = {
    ...context.anonymousActors[canisterName],
    [networkName]: {
      canisterId,
      actor,
      idlFactory,
    },
  }
})

const saveActor = assignImmer((context: RootContext, event: SaveActorEvent<any>) => {
  const { networkName, canisterName, canisterId, actor, idlFactory } = event.data
  // TODO: normalize?
  context.actors[canisterName] = {
    ...context.actors[canisterName],
    [networkName]: {
      canisterId,
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
    // TODO: send params to INIT?
    // To not have to store them in the context
    // inactive: {
    //   on: {
    //     INIT: {}
    //   }
    // },
    initializing: {
      on: {
        DONE: {
          target: "idle",
          actions: [],
        },
        DONE_AND_CONNECTED: {
          target: "connected",
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
          const { anonymousProviders, providers, preferredNetwork, networksConfig, canisters } = context
          const anonymousProvider = anonymousProviders[preferredNetwork].anonymous

          await Promise.all([
            ...Object.values(providers[preferredNetwork]).map(p => p.init()),
            anonymousProvider.init(),
          ])

          Object.keys(canisters).forEach(canisterName => {
            const canister = canisters[canisterName]
            Object.keys(canister).forEach(async networkName => {
              const { canisterId, idlFactory } = canister[networkName]
              const actor = await anonymousProvider.createActor(canisterId, idlFactory)
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

          // TODO: all networks?
          let connectedProviders = Object.values(providers[preferredNetwork]).map(p => new Promise<Provider>(async (resolve, reject) => {
            const isConnected = await p.isConnected()
            isConnected ? resolve(p) : reject()
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
          actions: ["onCancel"],
        },
        CONNECT_DONE: {
          target: "connected",
        },
        ERROR: {
          // actions: assign((context, event) => {
          //   return ({
          //     provider: event.data.provider,
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
          const provider = context.providers[context.preferredNetwork][_event.data.provider]
          if (!provider) {
            callback({
              type: "ERROR",
              data: {
                error: "Provider not found",
              },
            })
            return
          }
          const result = await provider.connect()
          result.match(() => {
              callback({
                type: "CONNECT_DONE",
                data: {
                  activeProvider: provider,
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
          Object.keys(context.canisters).forEach(canisterName => {
            const canister = context.canisters[canisterName]
            Object.keys(canister).forEach(async networkName => {
              const { canisterId, idlFactory } = canister[networkName]
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
        // TODO:
        // REMOVE_ACTOR: {
        //   actions: [removeActor],
        // },
        SAVE_ANONYMOUS_ACTOR: {
          actions: [saveAnonymousActor],
        },
        // REMOVE_ANONYMOUS_ACTOR: {
        //   actions: [removeAnonymousActor],
        // },
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
  whitelist?: Array<string>
  host?: string
  autoConnect?: boolean
  providerUrl?: string
  ledgerCanisterId?: string
  ledgerHost?: string
  appName?: string
}

type ClientOptions = {
  preferredNetwork?: string
  canisters?: {
    [canisterName: string]: {
      canisterId: string
      idlFactory: IDL.InterfaceFactory
    }
  }
  providers: Array<Provider> | ((config: Config) => Array<Provider>)
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

  public async createActor(canisterId, interfaceFactory) {
    if (!this._service.state.context.activeProvider) {
      return
    }
    // this._service.send({
    //   type: "CREATE_ACTOR", data: {
    //     [this._service.state.context.preferredNetwork]: {
    //       canisterName: canisterId,
    //       canisterId,
    //       idlFactory: interfaceFactory,
    //     },
    //   },
    // })
    return await this._service.state.context.activeProvider.createActor(
      canisterId,
      interfaceFactory,
    )
  }

  public createCanister({ canisterId, idlFactory }) {
    // this._service.subscribe((state) => {})

    let anonymousActor
    this.createAnonymousActor(canisterId, idlFactory).then(actor => {
      // TODO: init first
      anonymousActor = actor
    })
    return {
      // TODO: how to handle different networks?
      canisterId,
      get: (fn, options = {}) => {
        // TODO: network?
        const { mode = "auto", network = "local" } = options
        let unsub1
        let unsub2
        if (mode === "auto" || mode === "anonymous") {
          console.log({ anonymousActor })
          fn(anonymousActor)
        }
        this._service.subscribe((state) => {
          if (mode === "authenticated" || mode === "auto") {
            // TODO: no this. client
            unsub1 = this._emitter.on("connect", async () => {
              const actor = await this.createActor(canisterId, idlFactory)
              console.log("onConnected", actor)
              fn(actor)
            })
          }
          if (mode === "auto" || mode === "anonymous") {
            unsub2 = this._emitter.on("disconnect", () => {
              fn(anonymousActor)
            })
          }
          return () => {
            // check if unsub possible
            unsub1?.()
            unsub2?.()
          }
        })
      },
    }
  }

  public async createAnonymousActor(canisterId, interfaceFactory) {
    const result = await this._service.state.context.anonymousProviders[this._service.state.context.preferredNetwork].anonymous.createActor(
      canisterId,
      interfaceFactory,
    )
    return result
  }

  // // TODO: get IDL from canister?
  public async getNFTInfo({ canisterId, interfaceFactory = NFTStandards["DIP721v2"].IDL.default }) {
    const nftActor = await this.createAnonymousActor(canisterId, interfaceFactory)
    if (nftActor.isOk()) {
      //@ts-ignore
      const wrapper = new NFTStandards["DIP721v2"].Wrapper.default(nftActor.value, canisterId)
      const details = await nftActor.value.metadata()
      return { standard: "DIP721v2", logo: details.logo, name: details.name, symbol: details.symbol }
    }
  }

  // public async createNFTActor({ canisterId, standard }) {
  //   const interfaceFactory = NFTStandards[standard].IDL.default
  //   // TODO: not just anon
  //   const nftActor = await this.createAnonymousActor(canisterId, interfaceFactory)
  //   if (nftActor.isOk()) {
  //     //@ts-ignore
  //     const wrapper = new NFTStandards["DIP721v2"].Wrapper.default(nftActor.value, canisterId)
  //     return wrapper
  //   }
  // }

  public get providers() {
    return this._service.state.context[this._service.state.context.preferredNetwork].providers
  }

  public get activeProvider() {
    return this._service.state.context[this._service.state.context.preferredNetwork].activeProvider
  }

  public get anonymousProvider() {
    return this._service.state.context.anonymousProviders[this._service.state.context.preferredNetwork].anonymous
  }

  public get status() {
    return this._service.state.value
  }
}

const createClient = (config: ClientOptions) => {
  const {
    preferredNetwork = "local",
    canisters = {},
    providers = [],
    networks = {
      ic: {
        host: "https://ic0.app",
      },
      local: {
        host: window.location.origin,
      },
    },
  } = config

  const networksConfig: ClientOptions["networks"] = {
    ...Object.keys(networks).reduce((acc, networkName) => ({
      ...acc,
      [networkName]: {
        ...networks[networkName],
        whitelist: Object.values(canisters ?? {}).map(canister => (canister as {
          canisterId: string
          idlFactory: IDL.InterfaceFactory
        }).canisterId),
      },
    }), {}),
  }

  // TODO: per network canister configuration
  const canisterConfig = Object.keys(canisters).reduce((acc, canisterName) => ({
    ...acc,
    [canisterName]: {
      ...(Object.keys(networks).reduce((acc, networkName) => ({
        ...acc,
        [networkName]: {
          idlFactory: canisters[canisterName].idlFactory,
          canisterId: canisters[canisterName].canisterId,
        },
      }), {})),
    },
  }), {})

  const emitter = new Emitter()

  const rootMachine = createMachine<RootContext, RootEvent>({
    id: "root",
    initial: "idle",
    predictableActionArguments: true,
    context: {
      // TODO: move to config?
      canisters: canisterConfig,
      anonymousActors: {},
      actors: {},
      autoConnect: true,
      preferredNetwork,
      activeProvider: undefined,
      connectingProvider: undefined,
      // TODO: remove?
      networksConfig,
      anonymousProviders: Object.keys(networksConfig).reduce((acc, networkName) => {
        const networkConfig = networksConfig[networkName]
        // providers?.forEach(p => p.config = networkConfig)
        return {
          ...acc,
          [networkName]: {
            anonymous: new Anonymous(networkConfig),
          },
        }
      }, {}),
      providers: Object.keys(networksConfig).reduce((acc, networkName) => {
        const networkConfig = networksConfig[networkName]
        const createdProviders = typeof providers === "function" ? providers(networkConfig) : providers
        // providers?.forEach(p => p.config = networkConfig)
        return {
          ...acc,
          [networkName]: {
            ...(createdProviders?.reduce((acc, provider) => ({
              ...acc,
              [provider.meta.id]: provider,
            }), {}) ?? {}),
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
      onConnect: assign((context, event) => {
        emitter.emit("connect", event.data)
        return {
          connectingProvider: undefined,
          activeProvider: event.data.activeProvider,
        }
      }),
      onCancel: assign((context, event) => {
        emitter.emit("cancel")
        // TODO:?
        return {
          connectingProvider: undefined,
        }
      }),
      onConnecting: assign((context, event) => {
        emitter.emit("connecting")
        const connectingProvider = context.providers[context.preferredNetwork][event.data.provider]
        // TODO: not working
        return {
          connectingProvider,
        }
      }),
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
