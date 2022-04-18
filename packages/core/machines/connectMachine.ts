import { createMachine, assign, forwardTo } from "xstate"
import { Actor, HttpAgent } from "@dfinity/agent"

const canisterStates = {
  id: "canisters",
  initial: "idle",
  states: {

    "idle": {
      invoke: {
        id: "anonymousActorService",
        autoForward: true,
        src: (context, _event) => (callback, onReceive) => {
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
      },
      on: {
        CREATE_ANONYMOUS_ACTOR: {
          actions: forwardTo("anonymousActorService"),
        },
        SAVE_ANONYMOUS_ACTOR: {
          actions: assign((context, event) => ({
            anonymousActors: { ...context.anonymousActors, [event.data.canisterName]: event.data.actor },
          })),
        },
      },
    },

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
            provider: event.data.provider,
          })),
        },
        DONE_AND_CONNECTED: {
          target: "connected",
          actions: [
            assign((context, event) => ({
              providers: event.data.providers,
              provider: event.data.provider,
              // wallet: event.data.wallet,
              identity: event.data.identity,
              principal: event.data.principal,
            })),
          ],
        },
      },
      invoke: {
        id: "init",
        src: (context, event) => async (callback, onReceive) => {
          // TODO: clean up
          const { whitelist, host, dev, connectors, connectorConfig } = context
          let providers = connectors.map(Connector => new Connector({
            whitelist,
            host,
            dev,
            ...(connectorConfig?.[Connector.id] ? connectorConfig[Connector.id] : {}),
          }))
          await Promise.allSettled(providers.map(p => p.init()))
          let maybeProviders = providers.map(p => new Promise(async (resolve, reject) => {
            const isAuthenticated = await p.isAuthenticated()
            isAuthenticated ? resolve(p) : reject()
          }))
          const maybeSignedInProvider = Promise.any(maybeProviders)

          maybeSignedInProvider.then((signedInProvider) => {
            callback({
              type: "DONE_AND_CONNECTED",
              data: {
                providers,
                provider: signedInProvider,
                // wallet: signedInProvider.wallet,
                identity: signedInProvider.identity,
                principal: signedInProvider.principal,
              },
            })
          }).catch(e => {
            // TODO: handle failures
            // TODO: action
            callback({ type: "DONE", data: { providers } })
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
                await provider.connect()
                callback({
                  type: "DONE",
                  // TODO: fix?
                  data: {
                    provider,
                    // wallet: provider.wallet,
                    identity: provider.identity,
                    principal: provider.principal,
                  },
                })
              } catch (e) {
                console.log("connect failed??", e)
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
              provider: event.data.provider,
              // wallet: event.wallet,
              identity: event.data.identity,
              principal: event.data.principal,
            })),
          ],
        },
        ERROR: {
          // actions: assign((context, event) => {
          //   return ({
          //     provider: event.data.provider,
          //     wallet: event.data.wallet,
          //     identity: event.data.identity,
          //     principal: event.data.principal,
          //   })
          // }),
        },
      },
    },

    "connected": {
      entry: ["onConnect"],
      invoke: {
        id: "actorService",
        autoForward: true,
        src: (context, _event) => (callback, onReceive) => {
          onReceive(async (e) => {
            if (e.type === "CREATE_ACTOR") {
              const actor = await context.provider.createActor(e.data.canisterId, e.data.idlFactory)
              callback({ type: "SAVE_ACTOR", data: { actor, canisterName: e.data.canisterName } })
            }
          })
        },
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
      },
    },

    // TODO: not separate state
    "disconnecting": {
      invoke: {
        id: "disconnect",
        src: (context, event) => async () => {
          await context.provider.disconnect()
          return {}
        },
        onDone: {
          target: "idle",
          // TODO: empty context
          actions: ["onDisconnect"],
        },
        onError: {
          target: "connected",
          actions: [],
        },
      },
    },
  },
}

const rootMachine = createMachine({
  id: "root",
  initial: "inactive",
  context: {
    connectorConfig: {},
    host: window.location.origin,
    dev: false,
    whitelist: [],
    connectors: [],
    identity: undefined,
    principal: undefined,
    provider: undefined,
    // wallet: undefined,
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
            connectorConfig: event.data.connectorConfig || {},
            whitelist: event.data.whitelist || [],
            host: event.data.host || window.location.origin,
            connectors: event.data.connectors || [],
            dev: event.data.dev,
          })),
        },
      },
    },
    "idle": {
      id: "connect",
      type: "parallel",
      states: {
        canisters: canisterStates,
        auth: authStates,
      },
    },
  },
})

export { rootMachine as connectMachine }
