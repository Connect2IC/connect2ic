<script lang="ts">
  import astroXLogo from "../../assets/astrox.jpeg"
  import "../../connect2ic.css"

  export let dark = false
</script>

<button on:click class={"button-styles ii-styles"} style={dark ? `` : `background: #f4f4f4; color: black;`}>
  <img style="width: 55px;" class={"img-styles"} src={astroXLogo} />
  <div>
    <span class="button-label">
      AstroX
    </span>
    <span>
    Connect with your AstroX identity
    </span>
  </div>
</button>
