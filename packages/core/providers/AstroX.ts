import { IC } from "@astrox/connection"
import { PermissionsType } from "@astrox/connection/lib/esm/types"

const provider = "astrox"

const AstroX = async (config = {
  whitelist: [],
  host: window.location.origin,
}) => {

  // const isAuthenticated = await client.isAuthenticated()
  let state = {}
  // if (isAuthenticated) {
  //   state = { identity, principal, client, provider }
  // }

  return {
    state,
    connect: async () => {
      const result = await new Promise(async (resolve, reject) => {
        await IC.connect({
          useFrame: !(window.innerWidth < 768),
          signerProviderUrl: process.env.isProduction!
            ? "https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/signer"
            : "http://localhost:8080/signer",
          walletProviderUrl: process.env.isProduction!
            ? "https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/transaction"
            : "http://localhost:8080/transaction",
          identityProvider: process.env.isProduction!
            ? "https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/login#authorize"
            : "http://localhost:8080/login#authorize",
          permissions: [PermissionsType.identity, PermissionsType.wallet],
          onAuthenticated: (icInstance: IC) => {
            const thisIC = window.ic ?? icInstance
            const principal = thisIC.principal.toText()
            const wallet = thisIC.wallet ?? "unknown"
            const isAuth = true
            console.log(thisIC, wallet)
            resolve({ principal })
          },
        })
      })
      return result
    },
    disconnect: async () => {
    },
  }
}

export default AstroX