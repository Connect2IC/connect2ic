import { authMachine } from "../machines/authMachine"
import { ref, onMounted, onUnmounted, computed, watchEffect } from "vue"
import { useSelector, useInterpret, useMachine } from "@xstate/vue"

const useAuth = ({
                   // providers = {},
                   onConnect = () => {
                   },
                   onDisconnect = () => {
                   },
                 }) => {
  const authService = useInterpret(authMachine, { devTools: true }, (state) => {
    // TODO:
  })
  const { state, send } = useMachine(authMachine, { devTools: true })
  // // TODO: useSelector not working?
  const identity = useSelector(authService, state => state.context.identity)
  const principal = useSelector(authService, state => state.context.principal)
  const status = useSelector(authService, state => state.value)

  // TODO: hook not needed?
  // onMounted(() => authService.send({ type: "INIT" }))
  authService.send({ type: "INIT" })

  // watchEffect(() => {
  //   console.log("use: ", status.value)
  // })

  return {
    identity,
    principal,
    status,
    connect: (provider) => {
      authService.send({ type: "CONNECT", provider })
    },
    disconnect: () => {
      authService.send({ type: "DISCONNECT" })
    },
  }
}

export default useAuth