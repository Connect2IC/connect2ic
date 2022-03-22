const provider = "plug"

const Plug = async (config = {
  whitelist: [],
  host: window.location.origin,
}) => {
  let client
  let state
  const connected = await window.ic.plug.isConnected()
  if (connected) {
    try {
      await window.ic.plug.createAgent(config) //?
      // TODO: never finishes if user doesnt login back
      let principal = await (await window.ic?.plug?.getPrincipal()).toString()

      // TODO: return identity?
      state = {
        principal,
        plug: window.ic.plug,
        provider,
      }
    } catch (e) {
      console.error(e)
    }
  }

  return {
    state,
    name: provider,
    connect: async () => {
      try {
        await (window as any)?.ic?.plug?.requestConnect(config)
        let principal = await (await window.ic?.plug?.getPrincipal()).toString()

        // TODO: return identity?
        state = {
          principal,
          plug: window.ic.plug,
          provider,
        }
      } catch (e) {
        // TODO: handle
        return
      }
      if (!window.ic?.plug) {
        window.open("https://plugwallet.ooo/", "_blank")
        return
      }
    },
    disconnect: async () => {
      // TODO: no method available in plug
      state = {}
    },
  }
}

export default Plug