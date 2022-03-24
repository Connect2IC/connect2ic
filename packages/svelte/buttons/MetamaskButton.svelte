<script lang="ts">
  import { metamaskLogo } from "@connect2ic/core"
  import "@connect2ic/core/connect2ic.css"
  export let dark = false
</script>

<button on:click class={"button-styles metamask-styles"} style={dark ? `` : `background: #f4f4f4; color: black;`}>
  <img class={"img-styles"} src={metamaskLogo} />
  <div>
  <span class="button-label">
  Metamask
  </span>
    <span>
    Connect with your Metamask wallet
    </span>
  </div>
</button>
