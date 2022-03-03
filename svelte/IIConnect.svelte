<script lang="ts">
  import { getContext } from "svelte"
  import { contextKey } from "./index"
  import dfinityLogo from "../assets/dfinity.svg"
  import IIButton from "./buttons/IIButton.svelte"
  import II from "../providers/InternetIdentity"

  export let dark = false
</script>

<IIButton dark={dark} />