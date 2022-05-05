import { createMachine, assign, forwardTo } from "xstate"
import { Actor, HttpAgent } from "@dfinity/agent"

const anonymousActorActions = {
  CREATE_ANONYMOUS_ACTOR: {
    actions: forwardTo("anonymousActorService"),
  },
  SAVE_ANONYMOUS_ACTOR: {
    actions: assign((context, event) => ({
      anonymousActors: { ...context.anonymousActors, [event.data.canisterName]: event.data.actor },
    })),
  },
}

const authStates = {
  id: "auth",
  initial: "initializing",
  states: {

    "initializing": {
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
              identity: event.data.identity,
              principal: event.data.principal,
            })),
          ],
        },
        ...anonymousActorActions,
      },
      invoke: {
        id: "init",
        src: (context, event) => async (callback, onReceive) => {
          // TODO: clean up
          const { providers, dev, host, whitelist } = context
          const providersWithConfig = providers.map(p => ({
            ...p,
            connector: new p.connector({ dev, host, whitelist }),
          }))
          await Promise.allSettled(providersWithConfig.map(p => p.connector.init()))
          let initializedProviders = providersWithConfig.map(p => new Promise(async (resolve, reject) => {
            const isConnected = await p.connector.isConnected()
            isConnected ? resolve(p) : reject()
          }))
          const authenticatedProviderPromise = Promise.any(initializedProviders)

          authenticatedProviderPromise.then((authenticatedProvider) => {
            callback({
              type: "DONE_AND_CONNECTED",
              data: {
                providers: providersWithConfig,
                activeProvider: authenticatedProvider,
                identity: authenticatedProvider.connector.identity,
                principal: authenticatedProvider.connector.principal,
              },
            })
          }).catch(e => {
            callback({ type: "DONE", data: { providers: providersWithConfig } })
          })
        },
        // onDone: {
        //   // TODO: => "connected"?
        //   actions: assign((context, event) => ({
        //     providers: event.data.providers,
        //   })),
        //   target: "idle",
        // },
      },
    },

    "idle": {
      invoke: {
        id: "connectService",
        autoForward: true,
        src: (context, _event) => (callback, onReceive) => {
          onReceive(async (e) => {
            // TODO: Handle cancellation with AbortController?
            const provider = context.providers.find(p => p.id === e.data.provider)
            if (e.type === "CONNECT") {
              try {
                await provider.connector.connect()
                callback({
                  type: "DONE",
                  // TODO: fix?
                  data: {
                    activeProvider: provider,
                    identity: provider.connector.identity,
                    principal: provider.connector.principal,
                  },
                })
              } catch (e) {
                callback({
                  // TODO: or cancel?
                  type: "ERROR",
                  data: {
                    error: e,
                    // TODO: fix?
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
        DONE: {
          target: "connected",
          actions: [
            assign((context, event) => ({
              activeProvider: event.data.activeProvider,
              identity: event.data.identity,
              principal: event.data.principal,
            })),
          ],
        },
        ERROR: {
          // actions: assign((context, event) => {
          //   return ({
          //     provider: event.data.provider,
          //     identity: event.data.identity,
          //     principal: event.data.principal,
          //   })
          // }),
        },
        ...anonymousActorActions,
      },
    },

    "connected": {
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

    "disconnecting": {
      invoke: {
        id: "disconnect",
        src: (context, event) => async () => {
          await context.activeProvider.connector.disconnect()
        },
        onDone: {
          target: "idle",
          // TODO: empty context
          actions: [
            assign((context, event) => ({
              activeProvider: undefined
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

const rootMachine = createMachine({
  id: "root",
  initial: "inactive",
  context: {
    host: window.location.origin,
    dev: false,
    autoConnect: true,
    whitelist: [],
    identity: undefined,
    principal: undefined,
    activeProvider: undefined,
    providers: [],
    actors: {},
    anonymousActors: {},
  },
  states: {
    "inactive": {
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
    "idle": {
      ...authStates,
      invoke: { id: "anonymousActorService", src: "anonymousActorService" },
    },
  },
}, {
  services: {
    "anonymousActorService": (context, _event) => (callback, onReceive) => {
      onReceive(async (e) => {
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

    "actorService": (context, _event) => (callback, onReceive) => {
      onReceive(async (e) => {
        if (e.type === "CREATE_ACTOR") {
          // Already initialized
          if (context.actors[e.data.canisterName]) {
            return
          }
          const actor = await context.activeProvider.connector.createActor(e.data.canisterId, e.data.idlFactory)
          callback({ type: "SAVE_ACTOR", data: { actor, canisterName: e.data.canisterName } })
        }
      })
    },
  },
})

export { rootMachine as connectMachine }
