import React, { useEffect, useContext, createContext } from "react"
import { authMachine } from "../core/machines/authMachine"
import { useSelector, useInterpret } from "@xstate/react"

const selectState = state => ({
  identity: state.context.identity,
  principal: state.context.principal,
  provider: state.context.provider,
  status: state.value,
})

export const useProvideAuth = (props) => {
  const authService = useInterpret(authMachine)
  const state = useSelector(authService, selectState)

  useEffect(() => {
    authService.send({ type: "INIT" })
  }, [authService])

  useEffect(() => {
    if (!state) {
      return
    }
    if (state.status === "connected") {
      props.onConnect(state)
    }
    if (state.status === "disconnected") {
      props.onDisconnect()
    }
  }, [state.status])

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

const AuthContext = createContext()

export const AuthProvider = ({ children, ...options }) => {
  const auth = useProvideAuth(options)
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}

export const useCanister = () => {
  return useContext(AuthContext)
}
