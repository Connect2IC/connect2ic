<script setup lang="ts">
import { onMounted, onUnmounted, watch } from "vue"
import { useConnect, useDialog, useProviders } from "../composables"

const { isOpen, close, open } = useDialog()
const providers = useProviders()

const { connect } = useConnect({
  onConnect: () => {
    close()
  },
})

watch(isOpen, ($isOpen) => {
  if ($isOpen) {
    document.body.style.overflow = "hidden"
  }
  if (!$isOpen) {
    document.body.style.overflow = "unset"
  }
})

const emit = defineEmits(["onClose", "onClickInside"])
const onClose = () => {
  close()
  emit("onClose")
}

const onClickInside = (e) => {
  e.stopPropagation()
  emit("onClickInside")
}

const { dark = false } = defineProps<{
  dark?: boolean
}>()

const handleEsc = (event) => {
  if (event.keyCode === 27) {
    close()
  }
}
onMounted(() => window.addEventListener("keydown", handleEsc))
onUnmounted(() => window.removeEventListener("keydown", handleEsc))

</script>

<template>
  <div v-if="isOpen" :class="`dialog-styles ${dark ? ' dark' : ' light'}`" @click="onClose">
    <div @click="onClickInside" class="dialog-container">
      <div>
        <button v-for="provider in providers" :key="provider.id" @click="() => connect(provider.id)"
                :class="`button-styles ${provider.id}-styles`">
          <img class="img-styles" :src="dark ? provider.icon.dark : provider.icon.light" />
          <div>
            <span class="button-label">{{ provider.name }}</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>