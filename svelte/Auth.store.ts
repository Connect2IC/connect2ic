import { derived, writable } from "svelte/store"
import "../connect2ic.css"
import { II, Metamask, Plug, Stoic } from "./index"

const createAuth = ({
                      // providers = {},
                      onConnect = () => {
                      },
                      onDisconnect = () => {
                      },
                    }) => {
  const status = writable("idle")
  const identity = writable()
  const principal = writable()
  const provider = writable()
  const providers = writable()
  const details = derived(
    [status, provider, providers],
    async ([_status, _provider, _providers]) => {
      console.log(_status, _provider)
      if (_status === "connecting" && _provider) {
        const res = await _providers[_provider].connect()

        // TODO: ??
        status.set("connected")
        return {
          identity: res.identity,
          principal: res.principal,
        }
        // identity.set(res.identity)
        // principal.set(res.principal)
        // // TODO: ??
      }
      if (_status === "disconnected") {
        state.set({})
        await providers[provider].disconnect()
      }
    },
  )
  const state = derived(
    [status, details, provider, providers],
    ([status, details, provider, providers]) => {
      return ({
        ...details,
        status: status,
        provider: provider,
        providers: providers,
      })
    },
  )

  const init = async () => {
    // TODO: FIX
    let p = { ii: await II(), plug: await Plug(), stoic: await Stoic(), metamask: await Metamask() }
    let res = await Promise.allSettled(Object.values(p))
    identity.set(res.identity)
    principal.set(res.principal)
    providers.set(p)
    provider.set(res.provider)
    // TODO: handle failures
  }
  // TODO: ?
  init()

  return {
    subscribe: state.subscribe,
    connect: async (p) => {
      status.set("connecting")
      provider.set(p)
    },
    disconnect: () => {
      // TODO: set disconnect to status?
      status.set("disconnected")
    },
  }
}

export default createAuth