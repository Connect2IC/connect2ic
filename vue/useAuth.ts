import "../connect2ic.css"
import { authMachine } from "../machines/authMachine"
import { ref, onMounted, onUnmounted } from "vue"
import { useSelector } from "@xstate/vue"
import { interpret } from "xstate"

const useAuth = ({
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
    }
  })

  // TODO: hook not needed?
  onMounted(() => authService.send({ type: "INIT" }))

  return {
    ...state,
    connect: (provider) => {
      authService.send({ type: "CONNECT", provider })
    },
    disconnect: () => {
      authService.send({ type: "DISCONNECT" })
    },
  }
}

export default useAuth