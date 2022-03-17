const provider = "plug"

const Plug = async (config = {
  whitelist: [],
  host: window.location.origin,
}) => {
  let client
  // if (!window.ic.plug.agent) {
  //   try {
  //     await window.ic.plug.createAgent(config)
  //     // TODO: never finishes if user doesnt login back
  //     let principal = await (await window.ic?.plug?.agent.getPrincipal()).toString()
  //     let res = {
  //       principal,
  //       plug: window.ic.plug, provider,
  //     }
  //     return res
  //   } catch (e) {
  //     console.error(e)
  //   }
  // }

  return {
    connect: async () => {
      try {
        await(window as any)?.ic?.plug?.requestConnect(config)
      } catch (e) {
        // TODO: handle
        return
      }
      if (!window.ic?.plug) {
        window.open("https://plugwallet.ooo/", "_blank")
        return
      }
    },
    name: provider,
    disconnect: async () => {

    },
  }
}

export default Plug