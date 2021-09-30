<script lang="ts">
  import dfinityLogo from "../assets/dfinity.svg"
  import { useII } from "./II.store"

  export let onConnect = () => {}

  const ii = useII({
    host: window.location.origin,
  })

  const onClick = async () => {
    let res = await ii.connect()
    onConnect(res)
  }

</script>

<button on:click={onClick} class={"button-styles ii-styles"}>
  <img class={"img-styles"} src={dfinityLogo} />
  Internet Identity
</button>