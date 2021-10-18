<script lang="ts">
  import MetamaskLogo from "../../assets/metamask-fox.svg"
  import "../../connect2ic.css"
  export let darkMode = false
</script>

<button on:click class={"button-styles metamask-styles"} style={darkMode ? `` : `background: #f4f4f4; color: black;`}>
  <img class={"img-styles"} src={MetamaskLogo} />
  <div>
  <span class="button-label">
  Metamask
  </span>
    <span>
    Connect with your Metamask wallet
    </span>
  </div>
</button>
