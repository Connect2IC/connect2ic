const name = "plug"

const Plug = async (config = {
  whitelist: [],
  host: window.location.origin,
}) => {
  let state
  const connected = await window.ic.plug.isConnected()
  if (connected) {
    try {
      await window.ic.plug.createAgent(config)
      // TODO: never finishes if user doesnt login back
      let principal = await (await window.ic.plug.getPrincipal()).toString()

      // TODO: return identity?
      state = {
        principal,
        // TODO: fix
        signedIn: true,
        provider: {
          name,
          plug: window.ic.plug,
        },
      }
    } catch (e) {
      console.error(e)
    }
  }

  return {
    state,
    name,
    connect: async () => {
      try {
        await window.ic.plug.requestConnect(config)
        let principal = await (await window.ic.plug.getPrincipal()).toString()

        // TODO: return identity?
        state = {
          principal,
          signedIn: true,
          provider: {
            name,
            plug: window.ic.plug,
          },
        }
      } catch (e) {
        // TODO: handle
        return
      }
      if (!window.ic.plug) {
        window.open("https://plugwallet.ooo/", "_blank")
        // TODO: throw?
        return
      }
      return state
    },
    disconnect: async () => {
      // TODO: not the best way?
      await window.ic.plug.disconnect()
      state = {}
    },
  }
}

export default Plug