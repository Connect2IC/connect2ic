import React, { useEffect, useState } from "react"
import "@connect2ic/core/style"
import {
  Dialog,
  IIButton,
  StoicButton,
  PlugButton,
  MetamaskButton,
  AstroXButton,
  useAuth,
} from "./index"

const Connect = (props) => {
  const {
    config = {
      ii: {},
      plug: {},
      stoic: {},
      metamask: {},
    },
    style = {},
    dark = false,
    onConnect = () => {
    },
    onDisconnect = () => {
    },
  } = props

  const auth = useAuth({
    onConnect,
    onDisconnect,
  })
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    if (auth.status === "connected") {
      setShowDialog(false)
    }
  }, [auth.status])

  return (
    <>
      {auth.status === "connected" ? (
        <button style={style} className="connect-button" onClick={() => auth.disconnect()}>
          Disconnect
        </button>
      ) : null}

      {auth.status !== "connected" ? (
        <button style={style} className="connect-button" onClick={() => setShowDialog(true)}>
          Connect
        </button>
      ) : null}

      {showDialog ? (
        <Dialog onClose={() => setShowDialog(false)}>
          <IIButton onClick={() => auth.connect("ii")} dark={dark} />
          <StoicButton onClick={() => auth.connect("stoic")} dark={dark} />
          <PlugButton onClick={() => auth.connect("plug")} dark={dark} />
          {/*<MetamaskButton onClick={() => auth.connect("metamask")} dark={dark} />*/}
          <AstroXButton onClick={() => auth.connect("astrox")} dark={dark} />
        </Dialog>
      ) : null}
    </>
  )
}

export default Connect