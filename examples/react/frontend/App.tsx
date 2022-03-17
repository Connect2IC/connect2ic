import React from "react"
import { Connect } from "connect2ic/react"
import { Intro } from "./Intro"

function App() {

  const onConnect = ({ provider, identity, principal }) => {
    console.log(provider, identity, principal)
  }

  const onDisconnect = () => {
  }

  return (
    <div className="App">
      <div className="auth-section">
        <Connect dark={false} onDisconnect={onDisconnect} onConnect={onConnect} />
      </div>
      <Intro />
    </div>
  )
}

export default App
