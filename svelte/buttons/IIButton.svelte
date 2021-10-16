<script lang="ts">
  import dfinityLogo from "../../assets/dfinity.svg"
  import "../../connect2ic.css"
  export let darkMode = false
</script>

<button on:click class={"button-styles ii-styles"} style={darkMode ? `` : `background: white; color: black;`}>
  <img style="width: 110px;" class={"img-styles"} src={dfinityLogo} />
  <span class="button-label">
  Internet Identity
  </span>
  Connect with your Internet Identity
</button>
