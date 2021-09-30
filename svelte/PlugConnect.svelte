<script lang="ts">
  import plugLight from "../assets/plugLight.svg"
  import "../connect2ic.css"
  import { usePlug } from "./Plug.store"

  export let onConnect = () => {}

  const plug = usePlug({
    whitelist: ["qvhpv-4qaaa-aaaaa-aaagq-cai"],
    host: window.location.origin,
  })

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

  const onClick = async () => {
    let res = await plug.connect()
    onConnect(res)
  }

</script>

<button on:click={onClick} class={"button-styles plug-styles"}>
  <img
    class={"img-styles"}
    src={plugLight}
    alt="Plug logo"
  />
  Plug
</button>