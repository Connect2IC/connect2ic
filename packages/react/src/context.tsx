import React, { createContext, useEffect, useState } from "react"
import { useInterpret, useSelector } from "@xstate/react"
import { connectMachine } from "@connect2ic/core"

const Connect2ICContext = createContext({})

const Connect2ICProvider = ({ children, canisters, host, dev, ...options }) => {
  // Hacky...
  const [action, setAction] = useState()
  const connectService = useInterpret(connectMachine, {
    devTools: true,
    actions: {
      onConnect: (context, event) => {
        Object.entries(canisters).forEach(([canisterName, val]) => {
          const { canisterId, idlFactory } = val
          connectService.send({ type: "CREATE_ACTOR", data: { canisterId, idlFactory, canisterName } })
        })
        setAction({ type: "onConnect", context, event })
      },
      onDisconnect: (context, event) => {
        setAction({ type: "onDisconnect", context, event })
      },
      onInit: (context, event) => {
        Object.entries(canisters).forEach(([canisterName, val]) => {
          const { canisterId, idlFactory } = val
          connectService.send({ type: "CREATE_ANONYMOUS_ACTOR", data: { canisterId, idlFactory, canisterName } })
        })
      },
    },
  })
  const [open, setOpen] = useState(false)

  const dialog = {
    open: () => setOpen(true),
    close: () => setOpen(false),
    isOpen: open,
  }

  useEffect(() => {
    connectService.send({
      type: "INIT",
      data: {
        dev,
        whitelist: options.whitelist || Object.values(canisters).map(canister => (canister as any).canisterId),
        host,
        canisters,
        ...options,
      },
    })
  }, [connectService, options])

  return (
    <Connect2ICContext.Provider value={{
      connectService,
      dialog,
      action
    }}>
      {children}
    </Connect2ICContext.Provider>
  )
}

export { Connect2ICProvider, Connect2ICContext }