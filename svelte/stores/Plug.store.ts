import { writable, derived } from "svelte/store"

const provider = "plug"

function createStore(config = {}) {
  const status = writable("idle")
  const opts = writable({
    whitelist: [],
    host: window.location.origin,
  })
  const state = derived([opts, status], async ([$opts, $status], set) => {
    if ($status === "disconnect") {
      set()
      return
    }

    if (!window.ic?.plug) {
      window.open("https://plugwallet.ooo/", "_blank")
      return
    }

    if ($status !== "connect") {
      return
    }
    let connected = false
    try {
      connected = await (window as any)?.ic?.plug?.requestConnect($opts)
    } catch (e) {
      status.set("disconnect")
      return
    }

    if (!connected) return

    if (!window.ic.plug.agent) {
      try {
        await window.ic.plug.createAgent($opts)
        // TODO: never finishes if user doesnt login back
        let principal = await (await window.ic?.plug?.agent.getPrincipal()).toString()
        let res = {
          principal,
          plug: window.ic.plug, provider,
          disconnect: () => status.set("disconnect"),
        }
        set(res)
      } catch (e) {
        console.error(e)
      }
    }
  })

  return {
    subscribe: state.subscribe,
    connect: () => status.set("connect"),
    disconnect: () => status.set("disconnect"),
  }
}

export default createStore