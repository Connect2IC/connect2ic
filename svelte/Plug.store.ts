import plugLight from "../assets/plugLight.svg"
import "../connect2ic.css"
import { readable, writable } from "svelte/store"
import { onMount } from "svelte"

const usePlug = ({ whitelist = [], host = window.location.origin }) => {
  let client
  const { subscribe, set } = writable()

  const connect = async () => {
    if (!(window as any).ic?.plug) {
      window.open("https://plugwallet.ooo/", "_blank")
      return
    }

    const connected = await (window as any)?.ic?.plug?.requestConnect({
      whitelist,
      host,
    })

    if (!connected) return

    if (!window.ic.plug.agent) {
      await window.ic.plug.createAgent({ whitelist, host })
    }
    let principal = (await window.ic.plug.agent.getPrincipal()).toString()
    let res = { plug: { principal, plug: window.ic.plug } }
    set(res)

    return res
  }

  const disconnect = () => {
    set(null)
  }

  const init = async () => {

    if (!(window as any).ic?.plug) {
      window.open("https://plugwallet.ooo/", "_blank")
      return
    }

    const connected = await window.ic.plug.isConnected()

    if (!connected) return

    if (!window.ic.plug.agent) {
      await window.ic.plug.createAgent({ whitelist, host })
    }
    let principal = (await window.ic.plug.agent.getPrincipal()).toString()
    let res = { plug: { principal, plug: window.ic.plug } }
    set(res)
  }

  onMount(init)

  return {
    subscribe,
    connect,
    disconnect,
  }
}
export { usePlug }