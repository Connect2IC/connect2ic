import { contextKey } from "../context"
import type { ContextState } from "../context"
import { getContext } from "svelte"

export function useDialog() {
  const context = getContext<ContextState>(contextKey)
  return {
    ...context.dialog
  }
}