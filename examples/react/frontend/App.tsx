import React from "react"
import "@connect2ic/core/style.css"
import { Connect, ConnectProvider } from "@connect2ic/react"
import { Intro } from "./Intro"
import * as counter from "canisters/counter"
import { inspect } from "@xstate/inspect"

inspect({
  // options
  // url: 'https://statecharts.io/inspect', // (default)
  iframe: false, // open in new window
})

function App() {

  const onConnect = ({ provider, identity, principal }) => {
  }

  const onDisconnect = () => {
  }

  return (
    <div className="App">
      <div className="auth-section">
        <Connect onDisconnect={onDisconnect} onConnect={onConnect} dark={false} />
      </div>
      <Intro />
    </div>
  )
}

const canisters = { counter }
const whitelist = Object.values(canisters).map(canister => canister.canisterId)
const host = window.location.origin

export default () => (
  <ConnectProvider host={host} whitelist={whitelist} canisters={canisters}>
    <App />
  </ConnectProvider>
)
