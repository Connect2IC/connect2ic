import React, { CSSProperties, PropsWithChildren, useEffect, useState } from "react"
import {
  useConnect, useDialog,
} from "../index"

type Props = {
  style?: CSSProperties
  dark?: boolean
  onConnect?: () => void
  onDisconnect?: () => void
}
const ConnectButton: React.FC<PropsWithChildren<Props>> = (props) => {
  const {
    style = {},
    dark = false,
    onConnect = () => {
    },
    onDisconnect = () => {
    },
    children,
  } = props

  const dialog = useDialog()
  const { disconnect, isConnected } = useConnect({
    onConnect,
    onDisconnect,
  })

  return (
    <>
      {!isConnected ? (
        <button onClick={() => dialog.open()} style={style} className="connect-button">
          {children ?? "Connect"}
        </button>
      ) : null}
      {isConnected ? (
        <button onClick={disconnect} style={style} className="connect-button">
          {children ?? "Disconnect"}
        </button>
      ) : null}
    </>
  )
}

export default ConnectButton