import { writable, derived } from "svelte/store"
import { AuthClient } from "@dfinity/auth-client"

const provider = "metamask"

const createStore = (config = {}) => {
  const status = writable("idle")
  const opts = writable({
    whitelist: [],
    host: window.location.origin,
    ...config,
  })
  const state = derived([opts, status], async ([$opts, $status], set) => {
    if ($status === "disconnect") {
      set()
      // await client.logout()
      return
    }
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
