import { writable, derived } from "svelte/store"
import { AuthClient } from "@dfinity/auth-client"

const provider = "ii"

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
    state = { identity, principal, client, provider }
  }

  return {
    state,
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
          state = { identity, principal, client, provider }
          return state
        } catch (e) {
          // TODO: handle errors
        }
      // }
    },
    disconnect: async () => {
      await client.logout()
    },
  }
}

export default II