import { Principal } from "@dfinity/principal"

export const CANISTER_MAX_LENGTH = 27
export const PRINCIPAL_REGEX = /(\w{5}-){10}\w{3}/
export const ALPHANUM_REGEX = /^[a-zA-Z0-9]+$/

export const isValidPrincipal = (text: string): boolean => Principal.fromText(text).toText() === text

export const validatePrincipalId = (text: string): boolean => {
  try {
    return Boolean(PRINCIPAL_REGEX.test(text) && isValidPrincipal(text))
  } catch (e) {
    return false
  }
}
export const validateAccountId = (text): boolean => text.length === 64 && ALPHANUM_REGEX.test(text)
export const validateCanisterId = (text: string): boolean => {
  try {
    return Boolean(text.length <= CANISTER_MAX_LENGTH && isValidPrincipal(text))
  } catch (e) {
    return false
  }
}

export const validateToken = (metadata: any): boolean => Boolean(!!metadata.decimal && !!metadata.name && !!metadata.symbol)
