import React from "react"
import "@connect2ic/core/style.css"
import { defaultConnectors } from "@connect2ic/core"
import { Connect, ConnectProvider } from "@connect2ic/react"
import { Intro } from "./Intro"
import * as counter from "canisters/counter"

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

export default () => (
  <ConnectProvider connectors={defaultConnectors} canisters={canisters}>
    <App />
  </ConnectProvider>
)
