import React, { createContext, useEffect, useState, PropsWithChildren } from "react"
import { useInterpret, useSelector } from "@xstate/react"
import type { Interpreter } from "xstate"
import { connectMachine } from "@connect2ic/core"
import type { RootContext, RootEvent, ProviderOptions } from "@connect2ic/core"
import type { IDL } from "@dfinity/candid"

type CanisterMap = {
  [canisterName: string]: {
    canisterId: string,
    idlFactory: IDL.InterfaceFactory
  }
}

const Connect2ICContext = createContext<{
  connectService: Interpreter<RootContext, any, RootEvent, any, any>
  dialog: {
    open: () => void
    close: () => void
    isOpen: boolean
  }
  action?: { type: string, event: RootEvent, context: RootContext }
  canisters: CanisterMap
}>({} as any)

type Props = {
  canisters?: CanisterMap,
  whitelist?: Array<string>
  host?: string,
  dev?: boolean,
  providers: Array<ProviderOptions>,
  autoConnect?: boolean
}

const Connect2ICProvider: React.FC<PropsWithChildren<Props>> = ({
                                                                  children,
                                                                  canisters = {},
                                                                  whitelist,
                                                                  host,
                                                                  dev,
                                                                  providers,
                                                                  autoConnect,
                                                                }) => {
  const [action, setAction] = useState<{ type: string, context: RootContext, event: RootEvent }>()
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
  const [open, setOpen] = useState<boolean>(false)

  const dialog = {
    open: () => setOpen(true),
    close: () => setOpen(false),
    isOpen: open,
  }

  useEffect(() => {
    // TODO: on options change?
    connectService.send({
      type: "INIT",
      data: {
        dev,
        whitelist: whitelist ?? Object.values(canisters).map(canister => (canister as any).canisterId),
        host,
        providers,
        autoConnect,
      },
    })
  }, [connectService])

  return (
    <Connect2ICContext.Provider value={{
      connectService,
      dialog,
      action,
      canisters,
    }}>
      {children}
    </Connect2ICContext.Provider>
  )
}

export { Connect2ICProvider, Connect2ICContext }