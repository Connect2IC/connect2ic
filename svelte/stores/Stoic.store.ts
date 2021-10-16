import { StoicIdentity } from "ic-stoic-identity"
import { writable, derived } from "svelte/store"

const createStore = (config) => {
  const status = writable("idle")
  const opts = writable({})
  const state = derived([opts, status], async ([$opts, $status], set) => {
    if ($status === "disconnect") {
      set({})
      await StoicIdentity.disconnect()
      return
    }
    if ($status === "connect") {
      let identity = await StoicIdentity.load()

      if (identity) {
        let res = { stoic: { identity, principal: identity.getPrincipal().toText(), stoic: StoicIdentity } }
        set(res)
        return
      }

      identity = await StoicIdentity.connect()
      let res = { stoic: { identity, principal: identity.getPrincipal().toText(), stoic: StoicIdentity } }
      set(res)
    }
  })

  return {
    subscribe: state.subscribe,
    connect: () => status.set("connect"),
    disconnect: () => status.set("disconnect"),
  }
}

export default createStore