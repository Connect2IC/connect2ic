import { contextKey } from "../context"
import type { Client } from "@connect2ic/core"
import { inject } from "vue"

export const useClient = (): Client => {
  const { client } = inject(contextKey)
  return client
}
