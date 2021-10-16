import { writable, derived } from "svelte/store"
import { AuthClient } from "@dfinity/auth-client"

const createStore = (config) => {
  const status = writable("idle")
  const opts = writable({
    whitelist: [],
    host: window.location.origin,
    ...config,
  })
  const state = derived([opts, status], async ([$opts, $status], set) => {
    if ($status === "disconnect" || $status === "idle") {
      set({})
      // await client.logout()
      return
    }

    let client = await AuthClient.create()
    const isAuthenticated = await client.isAuthenticated()

    if (isAuthenticated) {
      const identity = client.getIdentity()
      const principal = identity.getPrincipal().toString()
      let res = { ii: { identity, principal, client } }
      set(res)
    }
    const { identity, principal } = await new Promise((resolve, reject) => {
      client.login({
        identityProvider: "https://identity.ic0.app",
        onSuccess: () => {
          const identity = client.getIdentity()
          const principal = identity.getPrincipal().toString()
          resolve({ identity, principal })
        },
        onError: reject,
      })
    })
    let res = { ii: { identity, principal, client } }
    set(res)
    return res
  })

  return {
    subscribe: state.subscribe,
    connect: () => {
      status.set("connect")
    },
    disconnect: async () => {
      status.set("disconnect")
    },
  }
}

export default createStore
