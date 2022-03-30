import React, { useState, useEffect, useContext, createContext } from "react"
import { connectMachine } from "../core/machines/connectMachine"
import { useSelector, useInterpret } from "@xstate/react"

const selectState = state => ({
  identity: state.context.identity,
  principal: state.context.principal,
  provider: state.context.provider,
  status: state.value,
})

const ConnectContext = createContext({})

export const ConnectProvider = ({ children, ...options }) => {
  // TODO: expose in context
  const connectService = useInterpret(connectMachine, { devTools: true })
  const state = useSelector(connectService, selectState)

  useEffect(() => {
    connectService.send({ type: "INIT" })
  }, [connectService])

  return (
    <ConnectContext.Provider value={{ ...options, connectService }}>
      {children}
    </ConnectContext.Provider>
  )
}

export const useConnect = (props) => {
  // TODO: handle
  const {
    onConnect = () => {
    },
    onDisconnect = () => {
    },
  } = props
  const {
    connectService,
  } = useContext(ConnectContext)
  const state = useSelector(connectService, selectState)

  useEffect(() => {
    if (!state) {
      return
    }
    if (state.status === "connected") {
      onConnect(state)
    }
    if (state.status === "disconnected") {
      onDisconnect()
    }
  }, [state.status])

  return {
    ...state,
    connect: (provider) => {
      connectService.send({ type: "CONNECT", provider })
    },
    disconnect: () => {
      connectService.send({ type: "DISCONNECT" })
    },
  }
}

export const useCanister = (canisterName) => {
  // TODO: support anonymous identity?
  // TODO: support lazy loading canisters?
  // TODO: NNS, management, ledger canister support?
  const { canisters } = useContext(ConnectContext)
  const [actor, setActor] = useState()
  const { status } = useConnect({
    onConnect: ({ provider }) => {
      // TODO: createActor
      // but save in context?
      if (provider.name === "plug") {
        const { canisterId, canisterInterface } = canisters[canisterName]
        setActor(provider.plug.createActor(canisterId, canisterInterface))
      }
    },
  })

  return actor

  // return {
  //   value: 0,
  //   increment: () => {
  //   },
  // }
}
