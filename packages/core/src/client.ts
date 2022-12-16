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
import { NFTStandards, TokenStandards } from "./tokens"

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

export type RootEvent<Service = any> =
  | DoneEvent
  | ConnectDoneEvent
  | DoneAndConnectedEvent
  | ConnectEvent
  | CancelConnectEvent
  | DisconnectEvent
  | ErrorEvent

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
      },
      invoke: {
        id: "init",
        src: (context, event) => async (callback, onReceive) => {
          const { anonymousProviders, providers, preferredNetwork, networksConfig } = context
          const anonymousProvider = anonymousProviders[preferredNetwork].anonymous

          await Promise.all([
            ...Object.values(providers[preferredNetwork]).map(p => p.init()),
            anonymousProvider.init(),
          ])

          // TODO: all networks?
          let connectedProviders = Object.values(providers[preferredNetwork]).map(p => new Promise<Provider>(async (resolve, reject) => {
            const isConnected = await p.isConnected()
            isConnected ? resolve(p) : reject()
          }))

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
      on: {
        DISCONNECT: {
          target: "disconnecting",
          // TODO: pass provider?
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
  providers: Array<Provider> | ((config: Config) => Array<Provider>)
  networks?: {
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
    return await this._service.state.context.activeProvider.createActor(
      canisterId,
      interfaceFactory,
    )
  }

  public async createAnonymousActor(canisterId, interfaceFactory) {
    const result = await this._service.state.context.anonymousProviders[this._service.state.context.preferredNetwork].anonymous.createActor(
      canisterId,
      interfaceFactory,
    )
    return result
  }

  // TODO: put in useNFT()?
  // // TODO: get IDL from canister?
  public async getNFTInfo({ canisterId, interfaceFactory = NFTStandards["DIP721v2"].IDL.default }) {
    const nftActor = await this.createAnonymousActor(canisterId, interfaceFactory)
    if (nftActor.isOk()) {
      //@ts-ignore
      const details = await nftActor.value.metadata()
      return { standard: "DIP721v2", logo: details.logo, name: details.name, symbol: details.symbol }
    }
  }

  // TODO: put in useToken()?
  // // TODO: get IDL from canister?
  public async getTokenInfo({ canisterId, idlFactory = TokenStandards["DIP20"].IDL.default }) {
    const tokenActor = await this.createAnonymousActor(canisterId, idlFactory)
    if (tokenActor.isOk()) {
      //@ts-ignore
      const details = await tokenActor.value.getTokenInfo()
      return { standard: "DIP20", logo: details.logo, name: details.name, symbol: details.symbol }
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
        // whitelist: Object.values(canisters ?? {}).map(canister => (canister as {
        //   canisterId: string
        //   idlFactory: IDL.InterfaceFactory
        // }).canisterId),
      },
    }), {}),
  }

  const emitter = new Emitter()

  const rootMachine = createMachine<RootContext, RootEvent>({
    id: "root",
    initial: "idle",
    predictableActionArguments: true,
    context: {
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
