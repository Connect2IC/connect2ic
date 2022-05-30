import { contextKey } from "../context"
import {inject} from "vue"

export function useDialog() {
  const context = inject(contextKey)
  return {
    ...context.dialog
  }
}