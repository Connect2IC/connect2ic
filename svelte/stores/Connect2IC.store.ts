import { derived } from "svelte/store"
import "../../connect2ic.css"
import createII from "./II.store"
import createPlug from "./Plug.store"
import createStoic from "./Stoic.store"

const createStore = (config = {}) => {
  let ii = createII(config.ii)
  let plug = createPlug(config.plug)
  let stoic = createStoic(config.stoic)

  const status = derived([ii, plug, stoic], ([$ii, $plug, $stoic]) => {
    if ($ii || $plug || $stoic) {
      return "signed_in"
    }
    return "idle"
  })
  let state = derived([ii, plug, stoic, status], ([$ii, $plug, $stoic, $status]) => ({
    ii: $ii,
    plug: $plug,
    stoic: $stoic,
    status: $status,
  }))
  return {
    subscribe: state.subscribe,
    connect: async (provider) => {
      if (provider === "ii") {
        await ii.connect()
      }
      if (provider === "plug") {
        await plug.connect()
      }
      if (provider === "stoic") {
        await stoic.connect()
      }
    },
    disconnect: async () => {
      await Promise.all([
        plug.disconnect(),
        ii.disconnect(),
        stoic.disconnect(),
      ])
    },
  }
}

export default createStore