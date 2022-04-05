import { StoicIdentity } from "ic-stoic-identity"
import { Actor, HttpAgent } from "@dfinity/agent"

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
    createActor: async (canisterId, idlFactory) => {
      // TODO: pass identity
      const agent = new HttpAgent({ ...config })

      // Fetch root key for certificate validation during development
      // if(process.env.NODE_ENV !== "production") {
      agent.fetchRootKey().catch(err => {
        console.warn("Unable to fetch root key. Check to ensure that your local replica is running")
        console.error(err)
      })
      // }

      // TODO: add actorOptions?
      return Actor.createActor(idlFactory, {
        agent,
        canisterId,
      })
    },
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