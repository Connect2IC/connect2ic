<img height=240 src="https://i.imgur.com/gjyJF4g.png" />

# Connect

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

- Dialog with selection
- Custom hooks / stores
- Assets & branded buttons

## React

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
    <Connect dark={false} onConnect={onConnect} onDisconnect={onDisconnect} style={{/* custom styles */ }} />
  )
}
```

### Hooks
When you need more control
```jsx
import { II, Plug, Stoic, Metamask, useAuth } from "connect2ic/react"

let auth = useAuth({
  providers: [II(), Plug(), Stoic(), Metamask()],
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
auth.status
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
    <Connect dark={false} onConnect={onConnect} onDisconnect={onDisconnect} style={{/* custom styles */ }} />
  )
}
```

### Composition API
When you need more control
```jsx
import { II, Plug, Stoic, Metamask, createAuth } from "connect2ic/vue"

let auth = createAuth({
  providers: [II(), Plug(), Stoic(), Metamask()],
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
import { II, Plug, Stoic, Metamask, createAuth } from "connect2ic/svelte"

let auth = createAuth({
  providers: [II(), Plug(), Stoic(), Metamask()],
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