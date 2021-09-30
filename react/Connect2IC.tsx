import React, { useState } from "react"
import { IIConnect, useII } from "./II"
import { StoicConnect, useStoic } from "./Stoic"
import { usePlug, PlugConnect } from "./Plug"

const signOutStyles = {
  padding: "8px 25px",
  borderRadius: "10px",
  border: "3px solid black",
  fontSize: "20px",
  fontWeight: 600,
  color: "black",
  background: "transparent",
  outline: 0,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
}

const selectStyles = {
  padding: "8px 25px",
  borderRadius: "10px",
  border: "3px solid black",
  fontSize: "20px",
  fontWeight: 600,
  color: "black",
  background: "transparent",
  outline: 0,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
}

const Select = ({ children, ...props }) => {
  return (
    <div style={selectStyles} {...props}>{children}</div>
  )
}

const Separator = () => {
  return <div style={{ padding: "5px", width: "100%" }}></div>
}

function Connect2IC({
                      onConnect,
                      onDisconnect,
                      methods = ["ii", "stoic", "plug"],
                      signInText = "Sign in",
                      signOutText = "Sign out",
                    }) {
  const [status, setStatus] = useState("idle")
  const [method, setMethod] = useState()
  const connectHandler = (args) => {
    setStatus("signedIn")
    setMethod(args.type)
    onConnect(args)
  }
  const { connect: iiConnect, disconnect: iiDisconnect } = useII({ onConnect: connectHandler })
  const { connect: plugConnect, disconnect: plugDisconnect } = usePlug({
    onConnect: connectHandler,
    whitelist: ["qvhpv-4qaaa-aaaaa-aaagq-cai"],
    host: window.location.origin,
  })
  const { connect: stoicConnect, disconnect: stoicDisconnect } = useStoic({ onConnect: connectHandler })
  const disconnectHandler = () => {
    setStatus("idle")
    switch (method) {
      case "ii":
        iiDisconnect()
        break
      case "plug":
        plugDisconnect()
        break
      case "stoic":
        stoicDisconnect()
        break
    }
    onDisconnect()
  }

  const onSelect = () => {
    setStatus("selecting")
  }

  const close = () => {
    setStatus("idle")
  }

  const onClickInside = (e) => {
    e.stopPropagation()
  }

  return (
    <>
      {status === "idle" || status === "selecting" ? (
        <>
          <Select onClick={onSelect}>Sign in</Select>
        </>
      ) : null}
      {status === "selecting" ? (
        <div onClick={close} className="dialog-styles">
          <div onClick={onClickInside} style={{
            padding: "30px 50px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "white",
            cursor: "initial",
          }}>
            <button className={"connect-2-ic"}>{signInText}</button>
            <IIConnect onClick={iiConnect} />
            <Separator />
            <StoicConnect onClick={stoicConnect} />
            <Separator />
            <PlugConnect onClick={plugConnect} />

            <button onClick={close} className={"close-styles"}>
              Close
            </button>
          </div>
        </div>
      ) : null}

      {status === "signedIn" ? (
        <>
          <button style={signOutStyles} onClick={disconnectHandler} className="auth-button">{signOutText}</button>
        </>
      ) : null}
    </>
  )
}

export { Connect2IC }
