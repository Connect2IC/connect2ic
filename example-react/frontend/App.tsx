import React, { useState } from "react"
// import { Connect2IC } from "../../src/react"
import { Connect2IC } from "react"
import { Intro } from "./Intro"

function App() {

  const [signedIn, setSignedIn] = useState(false)
  const [principal, setPrincipal] = useState()
  const [method, setMethod] = useState()

  const onConnect = ({ provider, identity, principal }) => {
    setSignedIn(true)
    setPrincipal(principal)
    switch (provider) {
      case "ii":
        setMethod("Internet Identity")
        break
      case "plug":
        setMethod("Plug Wallet")
        break
      case "stoic":
        setMethod("Stoic Identity")
        break
    }
  }

  const onDisconnect = () => {
    setSignedIn(false)
  }

  return (
    <div className="App">
      <div className="auth-section">
        <Connect2IC methods={["stoic", "ii", "plug"]} onDisconnect={onDisconnect} onConnect={onConnect} />
      </div>
      <Intro />
      <h3>
        {signedIn ? (
          <>
            <p>Signed in as: {principal}</p>
            <br />
            with {method}
          </>
        ) : null}
      </h3>
    </div>
  )
}

export default App
