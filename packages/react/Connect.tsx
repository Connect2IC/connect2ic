import React, { useEffect, useState } from "react"
import {
  Dialog,
  IIButton,
  StoicButton,
  PlugButton,
  AstroXButton,
  useConnect,
} from "./index"
import { useSelector } from "@xstate/react"

const Connect = (props) => {
  const {
    config = {
      ii: {},
      plug: {},
      stoic: {},
      astrox: {},
    },
    style = {},
    dark = false,
    onConnect = () => {
    },
    onDisconnect = () => {
    },
  } = props

  const { connect, disconnect, ...state } = useConnect({
    onConnect,
    onDisconnect,
  })
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    if (state.status === "connected") {
      setShowDialog(false)
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
        <button style={style} className="connect-button" onClick={() => setShowDialog(true)}>
          Connect
        </button>
      ) : null}

      {showDialog ? (
        <Dialog onClose={() => setShowDialog(false)}>
          <IIButton onClick={() => connect("ii")} dark={dark} />
          <AstroXButton onClick={() => connect("astrox")} dark={dark} />
          <StoicButton onClick={() => connect("stoic")} dark={dark} />
          <PlugButton onClick={() => connect("plug")} dark={dark} />
        </Dialog>
      ) : null}
    </>
  )
}

export default Connect