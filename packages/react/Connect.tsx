import React, { useEffect, useState } from "react"
import {
  useConnect,
  useDialog
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

  const [dialog] = useDialog()
  const { connect, disconnect, ...state } = useConnect({
    onConnect,
    onDisconnect,
  })

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
    </>
  )
}

export default Connect