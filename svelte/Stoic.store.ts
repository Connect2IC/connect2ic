// @ts-ignore
import { StoicIdentity } from "ic-stoic-identity"
import stoicLogo from "../assets/stoic.png"
import "../connect2ic.css"
import { onMount } from "svelte"
import { readable, writable, get } from "svelte/store"

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

const useStoic = (options) => {
  let client
  const { subscribe, set } = writable()

  const init = async () => {
    const identity = await StoicIdentity.load()
    if (identity) {
      let res = { stoic: { identity, principal: identity.getPrincipal().toText() } }
      set(res)
    }
  }

  const connect = async () => {
    const identity = await StoicIdentity.connect()
    let res = { stoic: { identity, principal: identity.getPrincipal().toText() } }
    set(res)
    return res
  }

  const disconnect = () => {
    StoicIdentity.disconnect()
  }
  onMount(init)

  // const dispatch = action => {
  //   state.update(value => reducer(value, action));
  // }

  return {
    subscribe,
    connect,
    disconnect,
  }
}
export { useStoic }