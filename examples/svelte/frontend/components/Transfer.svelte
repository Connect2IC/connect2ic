<script lang="ts">
  import { useWallet, useTransfer } from "@connect2ic/svelte"

  const [wallet] = useWallet()
  const [transfer] = useTransfer({
    to: "fdbe41c9e8589e115e6187038fc99e3b0c6fea116b1084b95c0da152520db3d1",
    amount: Number(5),
  })

  const onPurchase = () => {
    transfer()
  }
</script>
<div class="example">
  {#if $wallet}
    <p>Buy me a beer</p>
    <button class="connect-button" on:click={onPurchase}>Purchase</button>
  {:else}
    <p class="example-disabled">Connect with a wallet to access this example</p>
  {/if}
</div>