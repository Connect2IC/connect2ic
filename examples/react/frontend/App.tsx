import React from "react"
import "@connect2ic/core/style.css"
import { defaultConnectors, walletConnectors } from "@connect2ic/core"
import { ConnectButton, ConnectDialog, Connect2ICProvider } from "@connect2ic/react"
import { Intro } from "./Intro"
import * as counter from "canisters/counter"

function App() {

  const onConnect = ({ provider, identity, principal }) => {
  }

  const onDisconnect = () => {
  }

  return (
    <div className="App">
      <ConnectDialog /* title="Sign in with"*/ />
      <div className="auth-section">
        <ConnectButton onDisconnect={onDisconnect} onConnect={onConnect} dark={false} />
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
  <Connect2ICProvider connectorConfig={{
    astrox: {
      providerUrl: "http://localhost:8080",
      ledgerCanisterId: "s24we-diaaa-aaaaa-aaaka-cai",
    },
    ii: {
      providerUrl: "http://wxns6-qiaaa-aaaaa-aaaqa-cai.localhost:8000",
    },
    stoic: {
      // providerUrl: "http://localhost:8080"
    }
  }} dev={true} connectors={defaultConnectors} canisters={canisters}>
    <App />
  </Connect2ICProvider>
)
