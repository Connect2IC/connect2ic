import { writable } from "svelte/store"
import { AuthClient } from "@dfinity/auth-client"
import "../connect2ic.css"
import { onMount } from "svelte"
import { readable } from "svelte/store"


function useConnect2IC(options) {
  let client
  const { subscribe, set } = writable()

  const init = async () => {
    // if (isAuthenticated) {
    //   set({
    //     type: "ii",
    //     identity,
    //     principal,
    //   })
    // }
  }

  onMount(init)

  return {
    subscribe,
    connect: async () => {
      // set(res)
      // return res
    },
    disconnect: async () => {
      // await client.logout()
    },
  }
}

export { useConnect2IC }