import React, { useEffect } from "react"
/*
 * Connect2ic provides essential utilities for IC app development
 */
import { defaultProviders } from "@connect2ic/core"
import { ConnectButton, ConnectDialog, Connect2ICProvider } from "@connect2ic/react"
import "@connect2ic/core/style.css"
/*
 * Import canister definitions like this:
 */
import * as counter from "canisters/counter"
/*
 * Some examples to get you started
 */
import { Counter } from "./components/Counter"
import { Transfer } from "./components/Transfer"
import { Profile } from "./components/Profile"
import logo from "./assets/dfinity.svg"

function App() {

  return (
    <div className="App">

      <div className="auth-section">
        <ConnectButton />
      </div>
      <ConnectDialog />

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="slogan">
          React+TypeScript Template
        </p>
        <p className="twitter">by <a href="https://twitter.com/miamaruq">@miamaruq</a></p>
      </header>

      <p className="examples-title">
        Examples
      </p>
      <div className="examples">
        <Counter />
        <Profile />
        <Transfer />
      </div>

    </div>
  )
}

export default () => (
  <Connect2ICProvider
    /*
     * Disables dev mode in production
     * Should be enabled when using local canisters
     */
    dev={import.meta.env.DEV}
    /*
     * Can be consumed throughout your app like this:
     *
     * const [counter] = useCanister("counter")
     *
     * The key is used as the name. So { canisterName } becomes useCanister("canisterName")
     */
    canisters={{
      counter,
    }}
    /*
     * List of providers
     */
    providers={defaultProviders}
  >
    <App />
  </Connect2ICProvider>
)
