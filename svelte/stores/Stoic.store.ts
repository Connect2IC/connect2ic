import { StoicIdentity } from "ic-stoic-identity"
import { writable, derived } from "svelte/store"

const provider = "stoic"

const createStore = (config = {}) => {
  const status = writable("idle")
  const opts = writable({})
  const state = derived([opts, status], async ([$opts, $status], set) => {
    if ($status === "disconnect") {
      console.log("disconnect!")
      await StoicIdentity.disconnect()
      set()
      return
    }

    let identity = await StoicIdentity.load()

    if (identity) {
      let res = {
        identity,
        principal: identity.getPrincipal().toText(),
        identity: StoicIdentity,
        provider,
        disconnect: () => status.set("disconnect"),
      }
      // connected not working?
      set(res)
      return
    }

    if ($status === "connect") {
      identity = await StoicIdentity.connect()
      let res = {
        identity,
        principal: identity.getPrincipal().toText(),
        identity: StoicIdentity,
        provider,
        disconnect: () => status.set("disconnect"),
      }
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