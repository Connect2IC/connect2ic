import { StoicIdentity } from "ic-stoic-identity"

const provider = "stoic"

const Stoic = async (config = {}) => {
  let client
  let identity = await StoicIdentity.load()
  let state

  if (identity) {
    state = {
      identity,
      principal: identity.getPrincipal().toText(),
      provider,
    }
    // connected not working?
  }

  return {
    name: provider,
    state,
    connect: async () => {
      let identity = await StoicIdentity.connect()
      let res = {
        identity,
        principal: identity.getPrincipal().toText(),
        provider,
      }
      return res
    },
    disconnect: async () => {
      await StoicIdentity.disconnect()
    },
  }
}

export default Stoic