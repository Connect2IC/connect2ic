import React, { createContext, useEffect, useState } from "react"
import { useInterpret } from "@xstate/react"
import { connectMachine } from "@connect2ic/core"

const Connect2ICContext = createContext({})

const Connect2ICProvider = ({ children, ...options }) => {
  // Hacky...
  const [action, setAction] = useState()
  const connectService = useInterpret(connectMachine, {
    devTools: true,
    actions: {
      onConnect: (context, event) => {
        setAction({ type: "onConnect", context, event })
      },
      onDisconnect: (context, event) => {
        setAction({ type: "onDisconnect", context, event })
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