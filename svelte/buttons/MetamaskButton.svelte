<script lang="ts">
  import MetamaskLogo from "../../assets/metamask-fox.svg"
  import "../../connect2ic.css"
  export let darkMode = false
</script>

<button on:click class={"button-styles metamask-styles"} style={darkMode ? `` : `background: white; color: black;`}>
  <img class={"img-styles"} src={MetamaskLogo} />
  <span class="button-label">
  Metamask
  </span>
  Connect to your Metamask wallet
</button>
