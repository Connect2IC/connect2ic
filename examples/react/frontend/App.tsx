import React from "react"
import "@connect2ic/core/style.css"
import { Connect, AuthProvider } from "@connect2ic/react"
import { Intro } from "./Intro"
import { createActor } from "canisters/counter"
import { inspect } from "@xstate/inspect"

inspect({
  // options
  // url: 'https://statecharts.io/inspect', // (default)
  iframe: false // open in new window
})

function App() {

  const onConnect = ({ provider, identity, principal }) => {
    console.log(provider, identity, principal)
  }

  const onDisconnect = () => {
  }

  return (
    <AuthProvider>
      <div className="App">
        <div className="auth-section">
          <Connect dark={false} onDisconnect={onDisconnect} onConnect={onConnect} />
        </div>
        <Intro />
      </div>
    </AuthProvider>
  )
}

export default App
