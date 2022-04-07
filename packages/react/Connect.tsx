import React, { useEffect, useState } from "react"
import {
  Dialog,
  IIButton,
  StoicButton,
  PlugButton,
  AstroXButton,
  InfinityButton,
  useConnect,
} from "./index"

const Connect = (props) => {
  const {
    style = {},
    dark = false,
    onConnect = () => {
    },
    onDisconnect = () => {
    },
  } = props

  const providerButtons = {
    ii: IIButton,
    stoic: StoicButton,
    plug: PlugButton,
    astrox: AstroXButton,
    infinity: InfinityButton,
  }

  const { connect, disconnect, dialog, providers, ...state } = useConnect({
    onConnect,
    onDisconnect,
  })

  useEffect(() => {
    if (state.status === "connected") {
      dialog.close()
    }
  }, [state.status])

  return (
    <>
      {state.status === "connected" ? (
        <button style={style} className="connect-button" onClick={() => disconnect()}>
          Disconnect
        </button>
      ) : null}

      {state.status !== "connected" ? (
        <button style={style} className="connect-button" onClick={() => dialog.open()}>
          Connect
        </button>
      ) : null}

      {dialog.isOpen ? (
        <Dialog onClose={() => dialog.close()}>
          {providers.map((provider) => {
            const ProviderButton = providerButtons[provider.id]
            return (
              <ProviderButton key={provider.id} onClick={() => connect(provider.id)} dark={dark} />
            )
          })}
        </Dialog>
      ) : null}
    </>
  )
}

export default Connect