import React, { createContext, useEffect, useState } from "react"
import { useInterpret, useSelector } from "@xstate/react"
import { connectMachine } from "@connect2ic/core"

export const ConnectContext = createContext({})

const ConnectProvider = ({ children, ...options }) => {
  const connectService = useInterpret(connectMachine, { devTools: true }, async (state) => {
    //   // TODO: move connecting state here
    //   // TODO: not just connected?
    //   // if (state.value === "connected") {
    //   //   await state.context.providers[event.provider].createActor(event.canisterId, event.idlFactory)
    //   // }
  })
  const [open, setOpen] = useState(false)

  const dialog = {
    open: () => setOpen(true),
    close: () => setOpen(false),
    isOpen: open,
  }

  useEffect(() => {
    const whitelist = options.whitelist || Object.values(options.canisters).map(canister => (canister as any).canisterId)
    connectService.send({ type: "INIT", whitelist, ...options })
  }, [connectService, options])

  return (
    <ConnectContext.Provider value={{ ...options, connectService, dialog }}>
      {children}
    </ConnectContext.Provider>
  )
}

export { ConnectProvider }