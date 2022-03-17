import { createMachine, assign } from "xstate"
import "../connect2ic.css"
// TODO: move index to root
import { InternetIdentity, Metamask, Plug, Stoic } from "../providers"


const authMachine = createMachine({
  id: "auth",
  initial: "inactive",
  context: {
    identity: undefined,
    principal: undefined,
    provider: undefined,
    providers: [],
  },
  states: {

    "inactive": {
      on: {
        INIT: {
          target: "initializing",
        },
      },
    },

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
            identity: event.data.identity,
            principal: event.data.principal,
          })),
        },
      },
      invoke: {
        id: "init",
        src: (context, event) => async (callback, onReceive) => {
          // TODO: clean up
          let providers = {
            ii: await InternetIdentity(),
            plug: await Plug(),
            stoic: await Stoic(),
            metamask: await Metamask(),
          }
          let signedInProviders = Object.values(providers).filter(p => p.state?.identity)
          let res = await Promise.allSettled(Object.values(providers))

          if (signedInProviders.length > 0) {
            // TODO: how to choose provider?
            let signedInProvider = signedInProviders[0]
            callback({
              type: "DONE_AND_CONNECTED", data: {
                providers,
                provider: signedInProvider.name,
                identity: signedInProvider.state.identity,
                principal: signedInProvider.state.principal,
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
      on: {
        CONNECT: {
          target: "connecting",
        },
      },
    },

    "connecting": {
      // TODO: This is weird. Shouldn't be a separate state
      on: {
        CONNECT: {
          target: "connecting",
        },
      },
      invoke: {
        id: "connect",
        // TODO: onCleanup?
        src: (context, event) => async () => {
          let res
          try {
            res = await context.providers[event.provider].connect()
          } catch (e) {
            // TODO:
          }
          return {
            provider: event.provider,
            identity: res.identity,
            principal: res.principal,
          }
        },
        onDone: {
          target: "connected",
          actions: assign((context, event) => ({
            provider: event.data.provider,
            identity: event.data.identity,
            principal: event.data.principal,
          })),
        },
      },
    },

    "connected": {
      on: {
        DISCONNECT: {
          target: "disconnecting",
          // TODO: pass provider?
        },
      },
    },

    // TODO: not separate state
    "disconnecting": {
      invoke: {
        id: "disconnect",
        src: (context, event) => async () => {
          await Promise.allSettled(Object.values(context.providers).map(p => p.disconnect()))
          // await context.providers[context.provider].disconnect()
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
})

export { authMachine }
