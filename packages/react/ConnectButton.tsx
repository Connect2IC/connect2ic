import React, { useEffect, useState } from "react"
import {
  useConnect,
  useDialog
} from "./index"

const ConnectButton = (props) => {
  const {
    style = {},
    dark = false,
    onConnect = () => {
    },
    onDisconnect = () => {
    },
    children
  } = props

  const [dialog] = useDialog()
  const { connect, disconnect, ...state } = useConnect({
    onConnect,
    onDisconnect,
  })

  return (
    <>
      {state.status === "connected" ? (
        <button style={style} className="connect-button" onClick={() => disconnect()}>
          {children ?? "Disconnect"}
        </button>
      ) : null}

      {state.status !== "connected" ? (
        <button style={style} className="connect-button" onClick={() => dialog.open()}>
          {children ?? "ConnectButton"}
        </button>
      ) : null}
    </>
  )
}

export default ConnectButton