<script lang="ts">
  // @ts-ignore
  import { StoicIdentity } from "ic-stoic-identity"
  import stoicLogo from "../assets/stoic.png"
  import "../connect2ic.css"
  import { useStoic } from "./Stoic.store"
  export let onConnect = () => {}

  const stoic = useStoic({
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
    "&:hover": {
      background: "black",
    },
  }

  const imgStyles = {
    height: "40px",
    marginLeft: "-1em",
    marginRight: "0.7em",
  }

  const onClick = async () => {
    let res = await stoic.connect()
    onConnect(res)
  }
</script>

<button on:click={onClick} class={"button-styles stoic-styles"}>
  <img class={"img-styles"} src={stoicLogo} alt="" />
  Stoic Wallet
</button>