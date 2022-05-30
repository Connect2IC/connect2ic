import { useConnect } from "./useConnect"
import type { IConnector, IWalletConnector } from "@connect2ic/core"
import { computed, ref } from "vue"
import type { Ref } from "vue"

export const useWallet = () => {
  const { isConnected, activeProvider } = useConnect()
  // TODO: kind of hacky
  const supportsWallet = computed(() => !!activeProvider.value?.connector.requestTransfer)
  const wallet: Ref<IConnector & Partial<IWalletConnector> | undefined> = computed(() => {
    return isConnected.value && supportsWallet.value && activeProvider.value ? (activeProvider.value.connector as IConnector & Partial<IWalletConnector>) : undefined
  })
  const loading = ref(true)
  const error = ref(false)

  return [wallet, { loading, error }] as const
}
