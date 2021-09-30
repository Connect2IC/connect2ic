import React, { useEffect } from "react"
// @ts-ignore
import { StoicIdentity } from "ic-stoic-identity"
import stoicLogo from "../assets/stoic.png"
import "../connect2ic.css"

const buttonStyles = {
  color: "white",
  width: "100%",
  padding: "15px 25px",
  border: "none",
  borderRadius: "10px",
  fontSize: "20px",
  fontWeight: 600,
  background: "transparent",
  outline: 0,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  "&:hover": {
    background: "black",
  },
}

const imgStyles = {
  height: "40px",
  marginLeft: "-1em",
  marginRight: "0.7em",
}

const useStoic = ({ onConnect }) => {

  const init = async () => {
    const identity = await StoicIdentity.load()
    if (identity) {
      onConnect({ type: "stoic", identity, principal: identity.getPrincipal().toText() })
    }
  }

  useEffect(() => {
    init()
  }, [])

  const connect = async () => {
    const identity = await StoicIdentity.connect()
    onConnect({ type: "stoic", identity, principal: identity.getPrincipal().toText() })
  }

  const disconnect = () => {
    StoicIdentity.disconnect()
  }


  return { connect, disconnect }
}

const StoicConnect = ({ onClick }) => {
  return (
    <>
      <button className={"button-styles stoic-styles"} onClick={onClick}>
        <img className={"img-styles"} src={stoicLogo} alt="" />
        Stoic Wallet
      </button>
    </>
  )
}

export { useStoic, StoicConnect }