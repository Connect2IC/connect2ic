<script lang="ts">
  import dfinityLogo from "../../assets/dfinity.svg"
  import "../../connect2ic.css"

  export let darkMode = false
</script>

<button on:click class={"button-styles ii-styles"} style={darkMode ? `` : `background: #f4f4f4; color: black;`}>
  <img style="width: 55px;" class={"img-styles"} src={dfinityLogo} />
  <div>
    <span class="button-label">
      Internet Identity
    </span>
    <span>
    Connect with your Internet Identity
    </span>
  </div>
</button>
