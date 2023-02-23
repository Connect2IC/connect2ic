import React, { createContext, useState, PropsWithChildren } from "react"
import type { Client } from "@connect2ic/core"
import { IDL } from "@dfinity/candid"

const Connect2ICContext = createContext<{
  client: Client
  dialog: {
    open: () => void
    close: () => void
    isOpen: boolean
  }
  canisters: {
    [canisterName: string]: {
      canisterId: string
      idlFactory: IDL.InterfaceFactory
    }
  }
  canisterIds: {
    [canisterId: string]: string
  }
  capRouterId?: string
}>({} as any)

type Props = {
  client: Client
  capRouterId?: string
  canisters: {
    [canisterName: string]: {
      canisterId: string
      idlFactory: IDL.InterfaceFactory
    }
  }
}

const Connect2ICProvider: React.FC<PropsWithChildren<Props>> = ({
                                                                  children,
                                                                  client,
                                                                  canisters,
                                                                  capRouterId,
                                                                }) => {
  const [open, setOpen] = useState<boolean>(false)

  const dialog = {
    open: () => setOpen(true),
    close: () => setOpen(false),
    isOpen: open,
  }

  const canisterIds = Object.keys(canisters).reduce((acc, canisterName) => {
    const canisterId = canisters[canisterName].canisterId
    return ({
      ...acc,
      [canisterId]: canisterName,
    })
  }, {})

  return (
    <Connect2ICContext.Provider value={{
      client,
      dialog,
      canisters,
      canisterIds,
      capRouterId,
    }}>
      {children}
    </Connect2ICContext.Provider>
  )
}

export { Connect2ICProvider, Connect2ICContext }