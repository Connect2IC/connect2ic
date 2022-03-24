<script setup lang="ts">
import { ref, onMounted } from "vue"
import { Connect } from "../../../packages/vue"

const onConnect = () => {

}

const onDisconnect = () => {

}
</script>

<template>
  <div class="auth-section">
    <Connect :dark="false" @on-connect="onConnect" @on-disconnect="onDisconnect" />
  </div>
</template>

<style scoped>
.auth-section {
  padding: 1em;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  text-align: right;
  position: fixed;
  top: 0;
  right: 0;
}

.auth-button {
  color: black;
  background: white;
  padding: 0 2em;
  border-radius: 60px;
  font-size: 1em;
  line-height: 40px;
  height: 33px;
  outline: 0;
  border: 0;
  cursor: pointer;
  text-decoration: underline;
  display: flex;
  align-items: center;
}
</style>
