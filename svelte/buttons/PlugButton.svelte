<script lang="ts">
  import plugDark from "../../assets/plugDark.svg"
  import plugLight from "../../assets/plugLight.svg"
  import "../../connect2ic.css"
  export let dark = false
</script>

<button on:click class={"button-styles plug-styles"} style={dark ? `` : `background: #f4f4f4; color: black;`}>
  <img
    class={"img-styles"}
    src={dark ? plugDark : plugLight}
    alt="Plug logo"
  />
  <div>
  <span class="button-label">
  Plug
  </span>
    <span>
    Connect with your Plug wallet
    </span>
  </div>
</button>
