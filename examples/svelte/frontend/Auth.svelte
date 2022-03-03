<script lang="ts">
  import { Connect } from "connect2ic/svelte"

  const onConnect = ({ provider, principal, identity }) => {
    console.log("connected with ", provider, principal, identity)
  }
  const onDisconnect = () => {
  }
</script>

<div style="padding: 15px; box-sizing: border-box; width: 100%; display: flex; justify-content: flex-end;">
  <Connect dark={false} onConnect={onConnect} onDisconnect={onDisconnect} />
</div>