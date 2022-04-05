import { createMachine, assign, interpret, forwardTo } from "xstate"
import { Actor, HttpAgent } from "@dfinity/agent"


const canisterStates = {
  id: "canisters",
  initial: "idle",
  states: {

    "idle": {
      invoke: {
        id: "anonymousCanisterService",
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

              const actor = Actor.createActor(e.idlFactory, {
                agent,
                canisterId: e.canisterId,
              })
              callback({ type: "SAVE_ANONYMOUS_ACTOR", actor, canisterName: e.canisterName })
            }
          })
        },
      },
      on: {
        CREATE_ANONYMOUS_ACTOR: {
          actions: forwardTo("anonymousCanisterService"),
        },
        SAVE_ANONYMOUS_ACTOR: {
          actions: assign((context, event) => ({
            anonymousCanisters: { ...context.anonymousCanisters, [event.canisterName]: event.actor },
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
          actions: assign((context, event) => ({
            providers: event.data.providers,
            provider: event.data.provider,
            // wallet: event.data.wallet,
            identity: event.data.identity,
            principal: event.data.principal,
          })),
        },
      },
      invoke: {
        id: "init",
        src: (context, event) => async (callback, onReceive) => {
          // TODO: clean up
          // Save in context?
          const { whitelist, host, dev, connectors } = context
          let providers = connectors.map(Connector => new Connector({ whitelist, host, dev }))
          await Promise.allSettled(providers.map(p => p.init()))
          // TODO: fix
          let maybeProviders = await Promise.allSettled(providers.map(async p => {
            const isAuthenticated = await p.isAuthenticated()
            return isAuthenticated ? p : false
          }))
          let signedInProviders = maybeProviders.filter(p => p)

          if (signedInProviders.length > 0) {
            let signedInProvider = signedInProviders[0]
            callback({
              type: "DONE_AND_CONNECTED", data: {
                providers,
                provider: signedInProvider,
                // wallet: signedInProvider.wallet,
                identity: signedInProvider.identity,
                principal: signedInProvider.principal,
              },
            })
          } else {
            // TODO: handle failures
            // TODO: action
            callback({ type: "DONE", data: { providers } })
          }
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
            const provider = context.providers.find(p => p.name === e.provider)
            if (e.type === "CONNECT") {
              let res
              try {
                await provider.connect()
                callback({
                  type: "DONE",
                  // TODO: fix?
                  provider,
                  // wallet: provider.wallet,
                  identity: provider.identity,
                  principal: provider.principal,
                })
              } catch (e) {
                callback({
                  // TODO: or cancel?
                  type: "ERROR",
                  error: e,
                  // TODO: fix?
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
          actions: assign((context, event) => {
            return ({
              provider: event.provider,
              // wallet: event.wallet,
              identity: event.identity,
              principal: event.principal,
            })
          }),
        },
        ERROR: {
          // actions: assign((context, event) => {
          //   return ({
          //     provider: event.provider,
          //     wallet: event.wallet,
          //     identity: event.identity,
          //     principal: event.principal,
          //   })
          // }),
        },
      },
    },

    "connected": {
      invoke: {
        id: "canisterService",
        autoForward: true,
        src: (context, _event) => (callback, onReceive) => {
          onReceive(async (e) => {
            if (e.type === "CREATE_ACTOR") {
              const actor = await context.provider.createActor(e.canisterId, e.idlFactory)
              callback({ type: "SAVE_ACTOR", actor, canisterName: e.canisterName })
            }
          })
        },
      },
      on: {
        CREATE_ACTOR: {
          actions: forwardTo("canisterService"),
        },
        DISCONNECT: {
          target: "disconnecting",
          // TODO: pass provider?
        },
        SAVE_ACTOR: {
          actions: assign((context, event) => ({
            canisters: { ...context.canisters, [event.canisterName]: event.actor },
          })),
        },
      },
    },

    // TODO: not separate state
    "disconnecting": {
      invoke: {
        id: "disconnect",
        src: (context, event) => async () => {
          await Promise.allSettled(context.providers.map(p => p.disconnect()))
          return {}
        },
        onDone: {
          target: "idle",
          // TODO: empty context
          actions: assign((context, event) => ({})),
        },
        onError: {
          target: "connected",
          actions: (context, event) => {
            // TODO: handle
          },
        },
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
    whitelist: [],
    connectors: [],
    identity: undefined,
    principal: undefined,
    provider: undefined,
    // wallet: undefined,
    providers: [],
    canisters: {},
    anonymousCanisters: {},
  },
  states: {
    "inactive": {
      on: {
        INIT: {
          target: "idle",
          actions: assign((context, event) => ({
            whitelist: event.whitelist,
            host: event.host,
            connectors: event.connectors,
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
