
<img height="100" src="https://connect2ic.github.io/docs/img/connect2ic_logo_light.png" />

# Connect2IC
A toolkit which makes it trivial to support any wallet or identity provider, and make authenticated calls to canisters.

### Note: This project is in an early stage and under heavy development


## Introduction
There are many new wallets coming out and adding support for these isn't always easy. Connect2ic allows you to get fully working auth for the most popular providers with only a few lines of code. Use the already styled `<ConnectDialog />` component or feel free to create your own. Connect2ic gives you full control and additionally provides you with convenient helper utilities such as `useCanister()` and `useTransfer()`.

## Documentation
Visit https://connect2ic.github.io/docs/

## Supported providers
- [Internet Identity](https://identity.ic0.app/)
- [Stoic Wallet](https://plugwallet.ooo/)
- [Plug](https://plugwallet.ooo/)
- [AstroX ME](https://astrox.me)
- [Infinity Wallet](https://chrome.google.com/webstore/detail/infinity-wallet/jnldfbidonfeldmalbflbmlebbipcnle)
- [NFID](https://nfid.one)



## Packages
| package | description |
| ----------- | ----------- |
| [@connect2ic/core]() | Core logic, connectors, assets and utilities |
| [@connect2ic/react]() | React components & hooks |
| [@connect2ic/vue]() | Vue components & composables |
| [@connect2ic/svelte]() | Svelte components & stores |

# React

## Quickstart

Following these steps will give you fully working auth with a `<ConnectButton />` and `<ConnectDialog />` as shown in the top image.

**1.** Install the necessary packages

```
npm i -S @connect2ic/core @connect2ic/react
```


**2.** Wrap your app with the Provider and optionally pass in canister definitions (as generated by dfx)

```jsx
import { defaultProviders } from "@connect2ic/core"
import { Connect2ICProvider } from "@connect2ic/react"
import "@connect2ic/core/style.css"
import * as counter from "canisters/counter"

const AppRoot = () => (
  <Connect2ICProvider
    canisters={{
      counter,
    }}
    providers={defaultProviders}
  >
    <App />
  </Connect2ICProvider>
)

```

**3.** Place the components

```jsx
import { ConnectButton, ConnectDialog, Connect2ICProvider, useConnect } from "@connect2ic/react"

function App() {
  
  const { isConnected, principal, activeProvider } = useConnect({
    onConnect: () => {
      // Signed in
    },
    onDisconnect: () => {
      // Signed out
    }
  })

  return (
    <>
      <ConnectButton />
      <ConnectDialog dark={false} />
    </>
  )
}

```

**4.** Done

<img height=340 src="https://i.imgur.com/aGREctC.png" />


### useConnect
When you need more control
```jsx
import { useConnect } from "@connect2ic/react"

const { isConnected, principal, activeProvider, connect, disconnect } = useConnect({
  onConnect: () => {
    // Signed in
  },
  onDisconnect: () => {
    // Signed out
  }
})

// true | false
isConnected

// string
principal

// connect
connect()

// disconnect
disconnect()

// "inactive" | "idle" | "connecting" | "connected" | "disconnecting"
status
```

### useCanister
Automatically switches between the anonymous & connected identity for the canister. Authenticated calls are now easy.
```jsx
import { useCanister } from "@connect2ic/react"

const [counter, { loading, error }] = useCanister("counter")

// Make calls normally
counter.increment()
```

### useDialog
Programmatically control the prestyled `<Dialog />` or check its state
```jsx
import { useDialog } from "@connect2ic/react"

const [dialog] = useDialog()

dialog.open()

dialog.close()

dialog.isOpen
```

### useWallet
Wallet info and addresses.
```jsx
import { useWallet } from "@connect2ic/react"

const [wallet] = useWallet()
```

### useBalance
Provides you with the users balances when a wallet is connected.
```jsx
import { useBalance } from "@connect2ic/react"

const [assets] = useBalance()
```

### useProviders
Gives you direct access to the instantiated Connector (provider). When you need more control.
```jsx
import { useProviders } from "@connect2ic/react"

const [providers] = useProviders()
```

## Vue

*Coming soon...*

## Svelte

*Coming soon...*
