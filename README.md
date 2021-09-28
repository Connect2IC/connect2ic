# Connect 2 IC

A button to solve all your (auth) problems
```
npm i -S connect2ic
```

For React, Vue, Svelte

Supports:
- [Internet Identity](https://identity.ic0.app/)
- [Stoic Wallet](https://plugwallet.ooo/)
- [Plug](https://plugwallet.ooo/)


Gives you an unstyled Button by default

<img src="https://i.imgur.com/v4H1twj.png" />

This pops up a dialog
<img src="https://i.imgur.com/iPdytgJ.png" />

Use same button to sign out

<img src="https://i.imgur.com/EFr6EXq.png" />

### React:
```jsx
import { Connect2IC } from "connect2ic/react"

function App() {
  const [signedIn, setSignedIn] = useState(false)

  const onConnect = ({ provider, identity, principal }) => {
    // Now pass in identity to HttpAgent, or whatever you need to do
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
