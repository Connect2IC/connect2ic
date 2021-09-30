import dfinityLogo from "../assets/dfinity.svg"
import { writable } from "svelte/store"
import { AuthClient } from "@dfinity/auth-client"
import "../connect2ic.css"
import { onMount } from "svelte"
import { readable } from "svelte/store"


function useII(options) {
  let client
  const { subscribe, set } = writable()

  const init = async () => {
    client = await AuthClient.create()
    const isAuthenticated = await client.isAuthenticated()

    if (isAuthenticated) {
      const identity = client.getIdentity()
      const principal = identity.getPrincipal().toString()
      let res = { ii: { identity, principal, client } }
      set(res)
    }
  }

  onMount(init)

  return {
    subscribe,
    connect: async () => {
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
      let res = { ii: { identity, principal, client } }
      set(res)
      return res
    },
    disconnect: async () => {
      await client.logout()
    },
  }
}

export { useII }