<script setup lang="ts">
import { useWallet, useTransfer } from "@connect2ic/vue"

const [wallet] = useWallet()
const [transfer] = useTransfer({
  to: "fdbe41c9e8589e115e6187038fc99e3b0c6fea116b1084b95c0da152520db3d1",
  amount: Number(5),
})

const onPurchase = () => {
  transfer()
}
</script>
<template>
  <div class="example">
    <template v-if="wallet">
      <p>Buy me a beer</p>
      <button class="connect-button" @click="onPurchase">Purchase</button>
    </template>
    <template v-else>
      <p class="example-disabled">Connect with a wallet to access this example</p>
    </template>
  </div>
</template>