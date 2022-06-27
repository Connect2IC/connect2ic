import React, { createContext, useState, PropsWithChildren } from "react"
import type { Client } from "@connect2ic/core"
import type { IDL } from "@dfinity/candid"

type CanisterMap = {
  [canisterName: string]: {
    canisterId: string,
    idlFactory: IDL.InterfaceFactory,
  }
}

const Connect2ICContext = createContext<{
  client: Client
  dialog: {
    open: () => void
    close: () => void
    isOpen: boolean
  }
  canisters: CanisterMap
}>({} as any)

type Props = {
  // TODO: fix
  client: any
}

const Connect2ICProvider: React.FC<PropsWithChildren<Props>> = ({
                                                                  children,
                                                                  client,
                                                                }) => {
  const [open, setOpen] = useState<boolean>(false)

  const dialog = {
    open: () => setOpen(true),
    close: () => setOpen(false),
    isOpen: open,
  }

  return (
    <Connect2ICContext.Provider value={{
      client,
      dialog,
    }}>
      {children}
    </Connect2ICContext.Provider>
  )
}

export { Connect2ICProvider, Connect2ICContext }