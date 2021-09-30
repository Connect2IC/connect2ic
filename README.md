
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
- *...request more*
 
For React, Vue & Svelte.
- Custom hooks / stores for all identity providers
- logos
- ready-to-use branded buttons



## Magic mode
Import just 1 magic button and get fully working auth. For the lazy.
Clicking it pops up the dialog in the screenshot.

<img height=30 src="https://i.imgur.com/7tlLD7D.png" /> / 
<img height=30 src="https://i.imgur.com/gHLZ76C.png" />


### React
```jsx
import { MagicButton } from "connect2ic/react"

function App() {
  const onConnect = ({ ii, plug, stoic, error }) => {
     // Signed in
    if (ii) //...
    if (plug) //...
    if (stoic) //...
    if (error) // Something went wrong
  }

  const onDisconnect = () => {
    // Signed out
  }

  return (
    <MagicButton onConnect={onConnect} onDisconnect={onDisconnect} style={{/* pls style it */}} />
  )
}
```

### Vue
```jsx
import { Connect2IC } from "connect2ic/react"

function App() {
  const onConnect = ({ ii, plug, stoic }) => {
    // Signed in
    if (ii) //...
    if (plug) //...
    if (stoic) //...
  }

  const onDisconnect = () => {
    // Signed out
  }

  return (
    <Connect2IC onConnect={onConnect} onDisconnect={onDisconnect} />
  )
}
```

### Svelte
```svelte
<script>
  import { MagicButton } from "connect2ic/svelte"

  const onConnect = ({ plug, stoic, ii }) => {
    if (plug) //...
    if (stoic) // ...
    if (ii) // ...
  }
  
  const onDisconnect = () => {
    // Signed out
  }
</script>

<MagicButton onConnect={onConnect} onDisconnect={onDisconnect} style={{/* pls style it */}} />
```

## Hooks / Stores

Unified apis to interact with all identity providers

### React
```jsx
useConnect2IC()
useII()
usePlug()
useStoic()
```

### Vue
```jsx
useConnect2IC()
useII()
usePlug()
useStoic()
```

### Svelte
```jsx
useConnect2IC()
useII()
usePlug()
useStoic()
```
