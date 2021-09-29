# Connect2IC

A toolkit to solve your (auth) problems
```
npm i -S connect2ic
```

Custom hooks / stores for all identity providers, logos & ready-to-use buttons.
For React, Vue & Svelte.

Sign in with:
- [Internet Identity](https://identity.ic0.app/)
- [Stoic Wallet](https://plugwallet.ooo/)
- [Plug](https://plugwallet.ooo/)

## Simple mode (Scroll down for custom usage)
Import just 1 component and get fully working auth. For the lazy.

Gives you an unstyled button by default.
Style it however you want

<img height=30 src="https://i.imgur.com/7tlLD7D.png" />

This pops up a dialog (See advanced usage for more control)

<img height=300 src="https://i.imgur.com/iPdytgJ.png" />

Use same button to sign out

<img height=30 src="https://i.imgur.com/gHLZ76C.png" />

### React
```jsx
import { Connect2IC } from "connect2ic/react"

function App() {
  const onConnect = ({ 
    provider, // "ii" | "plug" | "stoic"
    identity, // Pass it to HttpAgent. Most of the meat is here
    principal // Principal ID as string
  }) => {
    // Signed in
  }

  const onDisconnect = () => {
    // Signed out
  }

  return (
    <Connect2IC onDisconnect={onDisconnect} onConnect={onConnect} />
  )
}
```

### Vue
```jsx
import { Connect2IC } from "connect2ic/react"

function App() {
  const onConnect = ({ 
    provider, // "ii" | "plug" | "stoic"
    identity, // Pass it to HttpAgent. Most of the meat is here
    principal // Principal ID as string
  }) => {
    // Signed in
  }

  const onDisconnect = () => {
    // Signed out
  }

  return (
    <Connect2IC onDisconnect={onDisconnect} onConnect={onConnect} />
  )
}
```

### Svelte
```jsx
import { Connect2IC } from "connect2ic/react"

function App() {
  const onConnect = ({ 
    provider, // "ii" | "plug" | "stoic"
    identity, // Pass it to HttpAgent. Most of the meat is here
    principal // Principal ID as string
  }) => {
    // Signed in
  }

  const onDisconnect = () => {
    // Signed out
  }

  return (
    <Connect2IC onDisconnect={onDisconnect} onConnect={onConnect} />
  )
}
```

## Custom usage
