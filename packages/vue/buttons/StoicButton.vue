<script setup lang="ts">
import { stoicLogo } from "@connect2ic/core"
import "@connect2ic/core/style.css"

let dark = false

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
</script>

<template>
  <button class="button-styles stoic-styles" :style="dark ? `` : `background: #f4f4f4; color: black;`">
    <img class="img-styles" :src="stoicLogo" alt="" />
    <div>
      <span class="button-label">
      Stoic Wallet
      </span>
      <span>
        ConnectButton with your Stoic Wallet
      </span>
    </div>
  </button>
</template>

<!--<style scoped>-->
<!--@import "~@connect2ic/core/style";-->
<!--</style>-->