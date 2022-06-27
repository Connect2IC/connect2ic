<script setup lang="ts">
import { ref, provide } from "vue"
import { contextKey } from "./context"
import type { createClient } from "@connect2ic/core"

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
  client: ReturnType<typeof createClient>
}>()

provide(contextKey, {
  dialog,
  client,
})

</script>
<template>
  <slot></slot>
</template>
