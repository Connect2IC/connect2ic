import {
  createMachine,
  assign,
  forwardTo,
} from "xstate"
import type { MachineConfig, } from "xstate"
import { Actor, HttpAgent } from "@dfinity/agent"
import type { ActorSubclass } from "@dfinity/agent"
import type { ProviderOptions } from "../providers/index"
import type { IDL } from "@dfinity/candid"
import type { IConnector, IWalletConnector } from "../providers/connectors"

type Provider = {
  icon: any
  connector: IConnector & Partial<IWalletConnector>
  name: string
  id: string
}

export type RootContext = {
  host: string
  dev: boolean
  autoConnect: boolean
  whitelist: Array<string>
  principal?: string
  activeProvider?: Provider
  providers: Array<ProviderOptions>
  initializedProviders: Array<Provider>
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
    providers: Array<ProviderOptions>
    dev?: boolean,
    autoConnect?: boolean,
  }
}
type DoneEvent = { type: "DONE", data: { initializedProviders: Array<Provider> } }
type DoneAndConnectedEvent = { type: "DONE_AND_CONNECTED", data: { activeProvider: Provider, initializedProviders: Array<Provider>, principal: string } }
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

const anonymousActorActions = {
  CREATE_ANONYMOUS_ACTOR: {
    actions: forwardTo<RootContext, CreateAnonymousActorEvent>("anonymousActorService"),
  },
  SAVE_ANONYMOUS_ACTOR: {
    actions: assign<RootContext, SaveAnonymousActorEvent>((context, event) => ({
      anonymousActors: { ...context.anonymousActors, [event.data.canisterName]: event.data.actor },
    })),
  },
}

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
            initializedProviders: event.data.initializedProviders,
          })),
        },
        DONE_AND_CONNECTED: {
          target: "connected",
          actions: [
            assign((context, event) => ({
              initializedProviders: event.data.initializedProviders,
              activeProvider: event.data.activeProvider,
              principal: event.data.principal,
            })),
          ],
        },
        ...anonymousActorActions,
      },
      invoke: {
        id: "init",
        src: (context, event: InitEvent) => async (callback, onReceive) => {
          // TODO: clean up
          const { dev, host, whitelist } = context
          const initializedProviders = event.data.providers.map(p => ({
            ...p,
            connector: new p.connector({ dev, host, whitelist }),
          }))
          await Promise.allSettled(initializedProviders.map(p => p.connector.init()))
          let connectedProviders = initializedProviders.map(p => new Promise<Provider>(async (resolve, reject) => {
            const isConnected = await p.connector.isConnected()
            isConnected ? resolve(p) : reject()
          }))
          const connectedProviderPromise = Promise.any(connectedProviders)

          connectedProviderPromise.then((connectedProvider) => {
            callback({
              type: "DONE_AND_CONNECTED",
              data: {
                initializedProviders,
                activeProvider: connectedProvider,
                principal: connectedProvider.connector.principal!,
              },
            })
          }).catch(e => {
            // ???
            callback({ type: "DONE", data: { initializedProviders } })
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
            const provider = context.initializedProviders.find(p => p.id === e.data.provider)
            if (e.type === "CONNECT") {
              try {
                await provider!.connector.connect()
                callback({
                  type: "CONNECT_DONE",
                  // TODO: fix?
                  data: {
                    activeProvider: provider!,
                    principal: provider!.connector.principal!,
                  },
                })
              } catch (e) {
                callback({
                  // TODO: or cancel?
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
        ...anonymousActorActions,
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
        CREATE_ACTOR: {
          actions: forwardTo("actorService"),
        },
        DISCONNECT: {
          target: "disconnecting",
          // TODO: pass provider?
        },
        SAVE_ACTOR: {
          actions: assign((context, event) => ({
            actors: { ...context.actors, [event.data.canisterName]: event.data.actor },
          })),
        },
        ...anonymousActorActions,
      },
    },
    disconnecting: {
      invoke: {
        id: "disconnect",
        src: (context, event) => async () => {
          await context.activeProvider?.connector.disconnect()
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
      on: {
        ...anonymousActorActions,
      },
    },
  },
}


const rootMachine = createMachine<RootContext, RootEvent>({
  id: "root",
  initial: "inactive",
  context: {
    host: window.location.origin,
    dev: true,
    autoConnect: true,
    whitelist: [],
    principal: undefined,
    activeProvider: undefined,
    providers: [],
    initializedProviders: [],
    actors: {},
    anonymousActors: {},
  },
  schema: {
    context: {} as RootContext,
    events: {} as RootEvent,
  },
  states: {
    inactive: {
      on: {
        INIT: {
          target: "idle",
          actions: assign((context, event) => ({
            whitelist: event.data.whitelist || [],
            host: event.data.host || window.location.origin,
            providers: event.data.providers || [],
            dev: event.data.dev,
            autoConnect: event.data.autoConnect || true,
          })),
        },
      },
    },
    idle: {
      ...authStates,
      invoke: { id: "anonymousActorService", src: "anonymousActorService" },
    },
  },
}, {
  services: {
    anonymousActorService: (context, _event) => (callback, onReceive) => {
      onReceive(async (e: RootEvent) => {
        if (e.type === "CREATE_ANONYMOUS_ACTOR") {
          const { host } = context
          const agent = new HttpAgent({ host })

          // Fetch root key for certificate validation during development
          if (context.dev) {
            agent.fetchRootKey().catch(err => {
              console.warn("Unable to fetch root key. Check to ensure that your local replica is running")
              console.error(err)
            })
          }

          const actor = Actor.createActor(e.data.idlFactory, {
            agent,
            canisterId: e.data.canisterId,
          })
          callback({ type: "SAVE_ANONYMOUS_ACTOR", data: { actor, canisterName: e.data.canisterName } })
        }
      })
    },

    actorService: (context, _event) => (callback, onReceive) => {
      onReceive(async (e: RootEvent) => {
        if (e.type === "CREATE_ACTOR") {
          const actor = (await context.activeProvider!.connector.createActor(e.data.canisterId, e.data.idlFactory) as ActorSubclass)
          callback({ type: "SAVE_ACTOR", data: { actor, canisterName: e.data.canisterName } })
        }
      })
    },
  },
})

export { rootMachine as connectMachine }
