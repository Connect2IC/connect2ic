import React from "react"
import "@connect2ic/core/style.css"
import { defaultConnectors, walletConnectors } from "@connect2ic/core"
import { Connect, Dialog, ConnectProvider } from "@connect2ic/react"
import { Intro } from "./Intro"
import * as counter from "canisters/counter"

function App() {

  const onConnect = ({ provider, identity, principal }) => {
  }

  const onDisconnect = () => {
  }

  return (
    <div className="App">
      <Dialog />
      <div className="auth-section">
        <Connect onDisconnect={onDisconnect} onConnect={onConnect} dark={false} />
      </div>
      <Intro />
    </div>
  )
}

const canisters = { counter }

// ledger
// s24we-diaaa-aaaaa-aaaka-cai
// nns dapp
// st75y-vaaaa-aaaaa-aaalq-cai
// internet identity
// si2b5-pyaaa-aaaaa-aaaja-cai
export default () => (
  <ConnectProvider dev={true} connectors={defaultConnectors} canisters={canisters}>
    <App />
  </ConnectProvider>
)
