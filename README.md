<img height=340 src="https://uc4aa39bba5117b7fd265ab16084.previews.dropboxusercontent.com/p/thumb/ABhUwUFRjQphViTh7CqzcLK1gDRME5_OdVGbiqheCTPqWIz4f_DMhLPpeF3MGlKegK5hP_8MP3ZqNat3aO3eknsAO_naWrTCDTH5l0tnLryGI6VKAFr7F1vkRUMMJdEe2Q8k5e2KeL7kRU82oIZTUfG_y5vq65x3BEgyOjo2ohmfylBiT8eMgVvxNhMMl42Ln6Rw9xFZ1m--LSgabMDMufOHi1-JpmQAkmi1SPjs1aNWEZSgwdP7z9cpGptpfERCDYIZtC_9CV3hx-ttYvzyu1l9OI-dxepYhKLch2GSF9nyZl3XG9KHBRClfc0EFXS6lzQDvKaeKeJQVmukZOZ01Bzzp-h57t-pQsA2_ECBvt-fU6iHAZsRa7cjEB93PrS3lgKl4FZ1qON_hDpVwuEI8rI2/p.png" />

# Connect2IC

Auth and canister management for the IC made simple & other goodies.

## Introduction
This will give you a nice dialog out of the box to use for auth with the IC.

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
| [@connect2ic/canisters]() | Some useful canisters to aid with development |

# React

## Quickstart

Following these steps will give you fully working auth with a Connect button and dialog as shown in the screenshot.

1. Install the necessary packages

```
npm i -S @connect2ic/core @connect2ic/react
```


2. Wrap your app with the Provider

```jsx
import { defaultConnectors } from "@connect2ic/core"
import { Connect2ICProvider } from "@connect2ic/react"

export default () => (
  <Connect2ICProvider
    canisters={{
      counter,
    }}
    connectors={defaultConnectors}
  >
    <App />
  </Connect2ICProvider>
)

```

3. Place the components

```jsx
import { ConnectButton, ConnectDialog, Connect2ICProvider, useConnect } from "@connect2ic/react"

function App() {
  
  const { status } = useConnect({
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

### useConnect
When you need more control
```jsx
import { useConnect } from "connect2ic/react"

const { status, connect, disconnect } = useConnect({
  onConnect: () => {
  },
  onDisconnect: () => {
  },
})

// connect
connect()

// disconnect
disconnect()

// "inactive" | "idle" | "connected" | "disconnecting"
status
```

### useCanister
When you need more control
```jsx
import { useCanister } from "connect2ic/react"

const [counter, { loading, error }] = useCanister()
```

### useDialog
When you need more control
```jsx
import { useDialog } from "connect2ic/react"

const [dialog] = useDialog()

dialog.open()

dialog.close()

dialog.isOpen
```

### useWallet
When you need more control
```jsx
import { useWallet } from "connect2ic/react"

const [wallet] = useWallet()
```

### useBalance
When you need more control
```jsx
import { useBalance } from "connect2ic/react"

const [assets] = useBalance()
```

### useProviders
When you need more control
```jsx
import { useProviders } from "connect2ic/react"

const [providers] = useProviders()
```

## Vue
### Quick start
Fully working auth by importing 1 component. For the lazy.

```jsx
import { Connect } from "connect2ic/react"

function App() {
  const onConnect = ({ provider, identity, principal }) => {
    // Signed in
  }

  const onDisconnect = () => {
    // Signed out
  }

  return (
    <Connect dark={false} onConnect={onConnect} onDisconnect={onDisconnect} style={{/* custom styles */}} />
  )
}
```

### Composition API
When you need more control
```jsx
import { createAuth } from "connect2ic/vue"

let auth = createAuth({
  onConnect: ({ provider, identity, principal }) => {
  },
  onDisconnect: () => {
  },
})

// connect
auth.connect()

// disconnect
auth.disconnect()

// read
$auth.status
```

## Svelte
### Quick start
Fully working auth by importing 1 component. For the lazy.

```html

<script>
  import { Connect } from "connect2ic/svelte"

  const onConnect = ({ provider, identity, principal }) => {
    // Signed in
  }

  const onDisconnect = () => {
    // Signed out
  }
</script>

<Connect dark={false} onConnect={onConnect} onDisconnect={onDisconnect} style={{/* custom styles */ }} />
```

### Stores
When you need more control
```jsx
import { createAuth } from "connect2ic/svelte"

let auth = createAuth({
  onConnect: ({ provider, identity, principal }) => {
  },
  onDisconnect: () => {
  },
})

// connect
auth.connect()

// disconnect
auth.disconnect()

// read
$auth.status
```
