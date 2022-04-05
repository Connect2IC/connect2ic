import React, { useEffect, useState } from "react"
import {
  Dialog,
  IIButton,
  StoicButton,
  PlugButton,
  AstroXButton,
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
            const ProviderButton = providerButtons[provider.name]
            console.log(provider, ProviderButton)
            return (
              <ProviderButton onClick={() => connect(provider.name)} dark={dark} />
            )
          })}
        </Dialog>
      ) : null}
    </>
  )
}

export default Connect