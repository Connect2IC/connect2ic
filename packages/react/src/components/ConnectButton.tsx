import React, { CSSProperties, PropsWithChildren, useEffect, useState } from "react"
import {
  useConnect, useDialog,
} from "../index"
import { CLIENT_STATUS } from "@connect2ic/core"

//@ts-ignore
const isICX = !!window.icx

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
  const { disconnect, isConnected, isLocked, isIdle, isInitializing, connect, status, activeProvider } = useConnect({
    onConnect,
    onDisconnect,
  })

  const current = (() => {
    if (isInitializing) {
      return {
        text: "Loading...",
        action: () => isICX ? connect("icx") : dialog.open(),
      }
    }
    if (isLocked) {
      return {
        text: `${activeProvider!.meta.name} locked`,
        action: () => {
        },
      }
    }
    if (isConnected) {
      return {
        text: "Disconnect",
        action: disconnect,
      }
    }
    // isIdle
    return {
      text: "Connect",
      action: () => isICX ? connect("icx") : dialog.open(),
    }
  })()

  return (
    <>
      <button disabled={isLocked} onClick={current.action} style={style} className="connect-button">
        {children ?? current.text}
      </button>
      {/*{isInitializing ? (*/}
      {/*  <button onClick={() => isICX ? connect("icx") : dialog.open()} style={style} className="connect-button">*/}
      {/*    {children ?? "Loading..."}*/}
      {/*  </button>*/}
      {/*) : null}*/}
      {/*{isIdle ? (*/}
      {/*  <button onClick={() => isICX ? connect("icx") : dialog.open()} style={style} className="connect-button">*/}
      {/*    {children ?? "Connect"}*/}
      {/*  </button>*/}
      {/*) : null}*/}
      {/*{isLocked ? (*/}
      {/*  <button disabled style={style} className="connect-button">*/}
      {/*    {children ?? `${activeProvider!.meta.name} locked`}*/}
      {/*  </button>*/}
      {/*) : null}*/}
      {/*{isConnected ? (*/}
      {/*  <button onClick={disconnect} style={style} className="connect-button">*/}
      {/*    {children ?? "Disconnect"}*/}
      {/*  </button>*/}
      {/*) : null}*/}
    </>
  )
}

export default ConnectButton