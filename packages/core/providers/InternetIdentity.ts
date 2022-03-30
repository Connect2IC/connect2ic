import { AuthClient } from "@dfinity/auth-client"
// import { Actor, HttpAgent } from "@dfinity/agent"

const name = "ii"

const II = async (config = {
  whitelist: [],
  host: window.location.origin,
}) => {
  let client = await AuthClient.create(config)
  const isAuthenticated = await client.isAuthenticated()
  let state

  // TODO: figure out
  if (isAuthenticated) {
    const identity = client.getIdentity()
    const principal = identity.getPrincipal().toString()
    state = {
      identity,
      principal,
      client,
      signedIn: true,
      provider: {
        name,
      },
    }
  }

  return {
    state,
    name,
    connect: async () => {
      const isAuthenticated = await client.isAuthenticated()
      // if (!isAuthenticated) {
      try {
        const { identity, principal } = await new Promise((resolve, reject) => {
          client.login({
            identityProvider: "https://identity.ic0.app",
            onSuccess: () => {
              const identity = client.getIdentity()
              const principal = identity.getPrincipal().toString()
              resolve({ identity, principal })
            },
            onError: reject,
          })
        })
        state = {
          identity,
          principal,
          client,
          signedIn: true,
          provider: {
            name,
          },
        }
        return state
      } catch (e) {
        // TODO: handle errors
      }
      // }
    },
    disconnect: async () => {
      await client.logout()
    },
    createActor: async (canisterName, options) => {
      // // TODO: import by canisterName shouldnt be hardcoded to how create-ic-app works
      // // pass in the path to the Provider
      // const { canisterId, idlFactory } = import(`canisters/${canisterName}`)
      // const agent = new HttpAgent({ ...options?.agentOptions })
      // //
      // // // Fetch root key for certificate validation during development
      // if (process.env.NODE_ENV !== "production") {
      //   agent.fetchRootKey().catch(err => {
      //     console.warn("Unable to fetch root key. Check to ensure that your local replica is running")
      //     console.error(err)
      //   })
      // }
      //
      // // Creates an actor with using the candid interface and the HttpAgent
      // return Actor.createActor(idlFactory, {
      //   agent,
      //   canisterId,
      //   ...options?.actorOptions,
      // })
    },
  }
}

export default II