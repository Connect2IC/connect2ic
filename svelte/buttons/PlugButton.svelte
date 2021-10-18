<script lang="ts">
  import plugDark from "../../assets/plugDark.svg"
  import plugLight from "../../assets/plugLight.svg"
  import "../../connect2ic.css"
  export let darkMode = false

  const buttonStyles = {
    color: "white",
    width: "100%",
    padding: "15px 25px",
    border: "none",
    borderRadius: "10px",
    fontSize: "20px",
    fontWeight: 600,
    background: "transparent",
    outline: 0,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  }

  const imgStyles = {
    height: "40px",
    marginLeft: "-1em",
    marginRight: "0.7em",
  }
</script>

<button on:click class={"button-styles plug-styles"} style={darkMode ? `` : `background: #f4f4f4; color: black;`}>
  <img
    class={"img-styles"}
    src={darkMode ? plugDark : plugLight}
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
