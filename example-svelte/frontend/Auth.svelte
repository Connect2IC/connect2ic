<script lang="ts">
  import { MagicButton } from "../../svelte"

  const onConnect = ({ plug, stoic, ii, error }) => {
    if (plug) {
      console.log(plug)
    }
    if (stoic) {
      console.log(stoic)
    }
    if (ii) {
      console.log(ii)
    }
    if (error) {
      // handle error
    }
  }

  const onDisconnect = () => {
    console.log("disconnect")
  }
</script>

<div class="auth-section">
  <MagicButton onConnect={onConnect} onDisconnect={onDisconnect} />
</div>

<style>
    .auth-section {
        padding: 1em;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        text-align: right;
        position: fixed;
        top: 0;
        right: 0;
    }

    .auth-button {
        color: black;
        background: white;
        padding: 0 2em;
        border-radius: 60px;
        font-size: 1em;
        line-height: 40px;
        height: 33px;
        outline: 0;
        border: 0;
        cursor: pointer;
        text-decoration: underline;
        display: flex;
        align-items: center;
    }
</style>
