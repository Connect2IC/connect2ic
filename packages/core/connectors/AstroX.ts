import { IC, ICAuthClient as AuthClient } from "@astrox/connection"
import { PermissionsType } from "@astrox/connection/lib/esm/types"

const name = "astrox"

// TODO: classes
const AstroX = async (userConfig = {}) => {

  const config = {
    whitelist: [],
    providerUrl: "https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app",
    ledgerCanisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
    host: window.location.origin,
    ...userConfig,
  }

  let client = await AuthClient.create(config)
  const isAuthenticated = await client.isAuthenticated()
  let state

  // TODO: figure out
  if (isAuthenticated) {
    const identity = client.getIdentity()
    const principal = identity.getPrincipal().toString()
    state = {
      principal,
      client,
      signedIn: true,
      provider: {
        name,
      },
    }
  }

  return {
    state,
    name,
    createActor: async (canisterId, idlFactory) => {
      // // Fetch root key for certificate validation during development
      // // if(process.env.NODE_ENV !== "production") {
      // agent.fetchRootKey().catch(err => {
      //   console.warn("Unable to fetch root key. Check to ensure that your local replica is running")
      //   console.error(err)
      // })
      // // }
      return await window.ic.astrox.createActor(idlFactory, canisterId)
    },
    connect: async () => {
      const result = await new Promise(async (resolve, reject) => {
        await IC.connect({
          useFrame: !(window.innerWidth < 768),
          signerProviderUrl: `${config.providerUrl}/signer`,
          walletProviderUrl: `${config.providerUrl}/transaction`,
          identityProvider: `${config.providerUrl}/login#authorize`,
          permissions: [PermissionsType.identity, PermissionsType.wallet],
          ledgerCanisterId: config.ledgerCanisterId,
          onAuthenticated: (icInstance: IC) => {
            const thisIC = window.ic.astrox ?? icInstance
            const principal = thisIC.principal.toText()
            const identity = client.getIdentity()
            // ?
            const walletAddress = thisIC.wallet
            const wallet = {
              address: walletAddress,
              requestTransfer: (...args) => thisIC.requestTransfer(...args),
              queryBalance: (...args) => thisIC.queryBalance(...args),
              signMessage: (...args) => thisIC.signMessage(...args),
              // getManagementCanister: (...args) => thisIC.getManagementCanister(...args),
              // callClientRPC: (...args) => thisIC.callClientRPC(...args),
              // requestBurnXTC: (...args) => thisIC.requestBurnXTC(...args),
              // batchTransactions: (...args) => thisIC.batchTransactions(...args),
            }
            resolve({
              principal,
              identity,
              wallet,
              signedIn: true,
              provider: {
                name,
                ic: thisIC,
              },
            })
          },
        })
      })
      return result
    },
    disconnect: async () => {
      await client.logout()
    },
  }
}

export default AstroX