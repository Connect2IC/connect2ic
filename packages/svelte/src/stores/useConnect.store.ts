import "../core/style.css"
import { useSelector } from "@xstate/svelte"
import { getContext } from "svelte"
import { contextKey } from "../context"

const useConnect = ({
                      // providers = {},
                      onConnect = () => {
                      },
                      onDisconnect = () => {
                      },
                    }) => {
  // const connectService = interpret(connectMachine, { devTools: true }).start()
  const { connectService } = getContext(contextKey)
  const state = useSelector(connectService, state => {
    return {
      identity: state.context.identity,
      principal: state.context.principal,
      status: state.value,
      // TODO: get machine status?
    }
  })
  //
  // authService.send({ type: "INIT", data: {} })

  return {
    subscribe: state.subscribe,
    connect: (provider) => {
      authService.send({ type: "CONNECT", data: { provider } })
    },
    disconnect: () => {
      authService.send({ type: "DISCONNECT" })
    },
  }
}

export { useConnect }