import "../core/connect2ic.css"
import { authMachine } from "../core/machines/authMachine"
import { useSelector } from "@xstate/svelte"
import { interpret } from "xstate"

const createAuth = ({
                      // providers = {},
                      onConnect = () => {
                      },
                      onDisconnect = () => {
                      },
                    }) => {
  const authService = interpret(authMachine, { devTools: true }).start()
  const state = useSelector(authService, state => {
    return {
      identity: state.context.identity,
      principal: state.context.principal,
      status: state.value,
      // TODO: get machine status?
    }
  })

  authService.send({ type: "INIT" })

  return {
    subscribe: state.subscribe,
    connect: (provider) => {
      authService.send({ type: "CONNECT", provider })
    },
    disconnect: () => {
      authService.send({ type: "DISCONNECT" })
    },
  }
}

export default createAuth