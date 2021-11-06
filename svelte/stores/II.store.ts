import { writable, derived } from "svelte/store"
import { AuthClient } from "@dfinity/auth-client"

const provider = "ii"

const createStore = (config = {}) => {
  const status = writable("idle")
  const opts = writable({
    whitelist: [],
    host: window.location.origin,
    ...config,
  })
  const client = writable()
  // let client
  const state = derived([opts, status], async ([$opts, $status], set) => {
    switch ($status) {
      case "idle":

        break;
      case "disconnect":
        set()
        await client.logout()
        break;
      case "connect":

        break;
    }

    if ($status === "disconnect") {
      return
    }

    // TODO: set client
    client = await AuthClient.create()
    const isAuthenticated = await client.isAuthenticated()

    if (isAuthenticated) {
      const identity = client.getIdentity()
      const principal = identity.getPrincipal().toString()
      let res = { identity, principal, client, provider, disconnect: () => status.set("disconnect") }
      set(res)
      return
    }

    if ($status === "connect") {
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
      let res = { identity, principal, client, provider, disconnect: () => status.set("disconnect") }
      set(res)
      return
    }
  })

  const state = derived([], async([], set) => {

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