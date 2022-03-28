import { IC, ICAuthClient as AuthClient } from "@astrox/connection"
import { PermissionsType } from "@astrox/connection/lib/esm/types"

const provider = "astrox"

const AstroX = async (config = {
  whitelist: [],
  providerUrl: "https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app",
  host: window.location.origin,
}) => {

  let client = await AuthClient.create(config)
  const isAuthenticated = await client.isAuthenticated()
  let state

  // TODO: figure out
  if (isAuthenticated) {
    const identity = client.getIdentity()
    const principal = identity.getPrincipal().toString()
    state = { identity, principal, client, provider }
  }
  // const isAuthenticated = await client.isAuthenticated()
  // if (isAuthenticated) {
  //   state = { identity, principal, client, provider }
  // }

  return {
    state,
    name: provider,
    connect: async () => {
      const result = await new Promise(async (resolve, reject) => {
        await IC.connect({
          useFrame: !(window.innerWidth < 768),
          signerProviderUrl: `${config.providerUrl}/signer`,
          walletProviderUrl: `${config.providerUrl}/transaction`,
          identityProvider: `${config.providerUrl}/login#authorize`,
          permissions: [PermissionsType.identity, PermissionsType.wallet],
          ledgerCanisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
          onAuthenticated: (icInstance: IC) => {
            const thisIC = window.ic ?? icInstance
            const principal = thisIC.principal.toText()
            const wallet = thisIC.wallet ?? "unknown"
            const isAuth = true
            console.log(thisIC, wallet)
            resolve({ principal })
          },
          onError: (e) => {
            console.error(e)
          },
          onSuccess: (...props) => {
            console.log(props)
          },
        })
      })
      console.log(result)
      return result
    },
    disconnect: async () => {
      await client.logout()
    },
  }
}

export default AstroX