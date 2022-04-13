import React, { createContext, useEffect, useState } from "react"
import { useInterpret, useSelector } from "@xstate/react"
import { connectMachine } from "@connect2ic/core"
import { onDisconnect } from "../svelte/Connect.svelte"

export const ConnectContext = createContext({})

const ConnectProvider = ({ children, ...options }) => {
  // Hacky...
  const [action, setAction] = useState()
  const connectService = useInterpret(connectMachine, {
    devTools: true,
    actions: {
      // TODO: pass to useConnect how?
      onConnect: () => {
        console.log("onConnect action")
        if (action === "onConnect") {
          setAction(undefined)
        }
        setAction("onConnect")
      },
      onDisconnect: () => {
        console.log("onDisconnect action")
        if (action === "onDisconnect") {
          setAction(undefined)
        }
        setAction("onDisconnect")
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
    const whitelist = options.whitelist || Object.values(options.canisters).map(canister => (canister as any).canisterId)
    connectService.send({
      type: "INIT",
      whitelist,
      host: options.host,
      dev: options.dev,
      canisters: options.canisters,
      connectors: options.connectors,
      connectorConfig: options.connectorConfig,
    })
  }, [connectService, options])

  return (
    <ConnectContext.Provider value={{ ...options, connectService, dialog, action }}>
      {children}
    </ConnectContext.Provider>
  )
}

export { ConnectProvider }