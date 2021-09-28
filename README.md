# Connect2IC

One button to solve all your (auth) problems
```
npm i -S connect2ic
```

For React, Vue, Svelte

Supports:
- [Internet Identity](https://identity.ic0.app/)
- [Stoic Wallet](https://plugwallet.ooo/)
- [Plug](https://plugwallet.ooo/)


Gives you an unstyled button by default.
Style it however you want

<img height=30 src="https://i.imgur.com/7tlLD7D.png" />

This pops up a dialog (See advanced usage for more control)
<img src="https://i.imgur.com/iPdytgJ.png" />

Use same button to sign out

<img height=30 src="https://i.imgur.com/gHLZ76C.png" />

## React
```jsx
import { Connect2IC } from "connect2ic/react"

function App() {
  const [signedIn, setSignedIn] = useState(false)

  const onConnect = ({ 
    provider, // "ii" | "plug" | "stoic"
    identity, // Pass it to HttpAgent. Most of the meat is here
    principal // Principal ID as string
  }) => {
    setSignedIn(true)
  }

  const onDisconnect = () => {
    setSignedIn(false)
  }
  
  return (
    <Connect2IC onDisconnect={onDisconnect} onConnect={onConnect} />
  )
}
```

## Vue
```jsx
import { Connect2IC } from "connect2ic/react"

function App() {
  const [signedIn, setSignedIn] = useState(false)

  const onConnect = ({ 
    provider, // "ii" | "plug" | "stoic"
    identity, // Pass this to HttpAgent, or whatever you need to do
    principal // Principal as string
  }) => {
    setSignedIn(true)
  }

  const onDisconnect = () => {
    setSignedIn(false)
  }
  
  return (
    <Connect2IC onDisconnect={onDisconnect} onConnect={onConnect} />
  )
}
```

## Svelte
```jsx
import { Connect2IC } from "connect2ic/react"

function App() {
  const [signedIn, setSignedIn] = useState(false)

  const onConnect = ({ 
    provider, // "ii" | "plug" | "stoic"
    identity, // Pass this to HttpAgent, or whatever you need to do
    principal // Principal as string
  }) => {
    setSignedIn(true)
  }

  const onDisconnect = () => {
    setSignedIn(false)
  }
  
  return (
    <Connect2IC onDisconnect={onDisconnect} onConnect={onConnect} />
  )
}
```

# API
