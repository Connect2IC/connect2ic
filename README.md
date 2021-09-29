
<img height=240 src="https://i.imgur.com/iPdytgJ.png" />

# Connect2IC

A toolkit to solve your (auth) problems
```
npm i -S connect2ic
```

Sign in with:
- [Internet Identity](https://identity.ic0.app/)
- [Stoic Wallet](https://plugwallet.ooo/)
- [Plug](https://plugwallet.ooo/)
 
For React, Vue & Svelte.
- Custom hooks / stores for all identity providers
- logos
- ready-to-use branded buttons



## Simple mode
Import just 1 component and get fully working auth. For the lazy.

Gives you an unstyled button by default.
Style it however you want

<img height=30 src="https://i.imgur.com/7tlLD7D.png" /> / 
<img height=30 src="https://i.imgur.com/gHLZ76C.png" />

This pops up the selection dialog in the screenshot

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
