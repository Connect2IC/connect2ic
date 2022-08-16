<script setup lang="ts">
import { ref, provide } from "vue"
import { contextKey } from "./context"
import type { Client } from "@connect2ic/core"

let open = ref(false)
const dialog = {
  open: () => {
    open.value = true
  },
  close: () => {
    open.value = false
  },
  isOpen: open,
}

const { client } = defineProps<{
  client: Client
}>()

provide(contextKey, {
  dialog,
  client,
})

</script>
<template>
  <slot></slot>
</template>
