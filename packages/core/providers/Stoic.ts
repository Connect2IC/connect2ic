import { StoicIdentity } from "ic-stoic-identity"

const name = "stoic"

const Stoic = async (config = {}) => {
  let identity = await StoicIdentity.load()
  let state

  if (identity) {
    state = {
      identity,
      principal: identity.getPrincipal().toText(),
      signedIn: true,
      provider: {
        name,
      },
    }
    // connected not working?
  }

  return {
    name,
    state,
    connect: async () => {
      let identity = await StoicIdentity.connect()
      let res = {
        identity,
        principal: identity.getPrincipal().toText(),
        signedIn: true,
        provider: {
          name,
        },
      }
      return res
    },
    disconnect: async () => {
      await StoicIdentity.disconnect()
    },
  }
}

export default Stoic