import { writable, derived } from "svelte/store"

function createStore(config) {
  const status = writable("idle")
  const opts = writable({
    whitelist: [],
    host: window.location.origin,
  })
  const state = derived([opts, status], async ([$opts, $status], set) => {
    if ($status === "disconnect" || $status === "idle") {
      set({})
      return
    }

    if (!(window as any).ic?.plug) {
      window.open("https://plugwallet.ooo/", "_blank")
      return
    }

    const connected = await window.ic.plug.isConnected()

    if (!connected) return

    if (!window.ic.plug.agent) {
      try {
        let a = await window.ic.plug.createAgent($opts)
        // TODO: never finishes if user doesnt login back
      } catch (e) {
        console.error(e)
      }
    }

    let principal = (await window.ic.plug.agent.getPrincipal()).toString()
    let res = { plug: { principal, plug: window.ic.plug } }
    set(res)
  })

  return {
    subscribe: state.subscribe,
    connect: () => status.set("connect"),
    disconnect: () => status.set("disconnect"),
  }
}

export default createStore