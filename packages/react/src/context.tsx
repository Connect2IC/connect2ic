import React, { createContext, useEffect, useState } from "react"
import { useInterpret, useSelector } from "@xstate/react"
import { connectMachine } from "@connect2ic/core"

const Connect2ICContext = createContext({})

const Connect2ICProvider = ({ children, ...options }) => {
  // Hacky...
  const [action, setAction] = useState()
  const connectService = useInterpret(connectMachine, {
    devTools: true,
    actions: {
      onConnect: (context, event) => {
        // TODO: move all inside machine?
        Object.entries(options.canisters).forEach(([canisterName, val]) => {
          const { canisterId, idlFactory } = val
          connectService.send({ type: "CREATE_ACTOR", data: { canisterId, idlFactory, canisterName } })
        })

        setAction({ type: "onConnect", context, event })
      },
      onDisconnect: (context, event) => {
        setAction({ type: "onDisconnect", context, event })
      },
      onInit: (context, event) => {
        Object.entries(options.canisters).forEach(([canisterName, val]) => {
          const { canisterId, idlFactory } = val
          connectService.send({ type: "CREATE_ANONYMOUS_ACTOR", data: { canisterId, idlFactory, canisterName } })
        })
      }
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
        dev: true,
        ...options,
        whitelist: options.whitelist || Object.values(options.canisters).map(canister => (canister as any).canisterId),
      },
    })
  }, [connectService, options])

  return (
    <Connect2ICContext.Provider value={{ ...options, connectService, dialog, action }}>
      {children}
    </Connect2ICContext.Provider>
  )
}

export { Connect2ICProvider, Connect2ICContext }