<script lang="ts">
  import { astroxLogo } from "@connect2ic/core"
  import "@connect2ic/core/style.css"

  export let dark = false
</script>

<button on:click class={"button-styles ii-styles"} style={dark ? `` : `background: #f4f4f4; color: black;`}>
  <img style="width: 55px;" class={"img-styles"} src={astroxLogo} />
  <div>
    <span class="button-label">
      AstroX
    </span>
    <span>
    ConnectButton with your AstroX identity
    </span>
  </div>
</button>
