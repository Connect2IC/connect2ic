import { IC, ICAuthClient as AuthClient } from "@astrox/connection"
import { PermissionsType } from "@astrox/connection/lib/esm/types"
import { IConnector, IWalletConnector } from "./connectors"

class AstroXConnector implements IConnector, IWalletConnector {

  readonly id = "astrox"
  readonly name = "AstroX ME"
  #config: {
    whitelist: [string],
    providerUrl: string,
    ledgerCanisterId: string,
    host: string,
    dev: Boolean,
  }
  #identity?: any
  #principal?: string
  #ic?: any

  get identity() {
    return this.#ic.identity
  }
  get principal() {
    return this.#principal
  }
  get ic() {
    return this.#ic
  }

  constructor(userConfig) {
    this.#config = {
      whitelist: [],
      // TODO: check if dev
      providerUrl: "https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app",
      ledgerCanisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
      host: window.location.origin,
      dev: false,
      ...userConfig,
    }
  }

  async init() {
    this.#ic = await IC.create({
      useFrame: !(window.innerWidth < 768),
      signerProviderUrl: `${this.#config.providerUrl}/signer`,
      walletProviderUrl: `${this.#config.providerUrl}/transaction`,
      identityProvider: `${this.#config.providerUrl}/login#authorize`,
      permissions: [PermissionsType.identity, PermissionsType.wallet],
      ledgerCanisterId: this.#config.ledgerCanisterId,
      onAuthenticated: (icInstance: IC) => {
        this.#ic = window.ic.astrox ?? icInstance
        this.#principal = this.#ic.principal.toText()
        this.#identity = this.#ic.identity
        // this.#address = this.#ic.wallet
      },
    })
    // this.#ic = window.ic.astrox // ?? icInstance
    const isAuthenticated = await this.isAuthenticated()

    // TODO: figure out
    if (isAuthenticated) {
      this.#identity = this.#ic.identity
      this.#principal = this.#ic.principal
    }
  }

  async isAuthenticated() {
    return this.#ic.isAuthenticated()
  }

  async createActor(canisterId, idlFactory) {
    // TODO: move from @astrox/connection here?
    // // Fetch root key for certificate validation during development
    // // if(process.env.NODE_ENV !== "production") {
    // agent.fetchRootKey().catch(err => {
    //   console.warn("Unable to fetch root key. Check to ensure that your local replica is running")
    //   console.error(err)
    // })
    // // }
    return await this.#ic.createActor(idlFactory, canisterId)
  }

  async connect() {
    await this.#ic.connect({
      useFrame: !(window.innerWidth < 768),
      signerProviderUrl: `${this.#config.providerUrl}/signer`,
      walletProviderUrl: `${this.#config.providerUrl}/transaction`,
      identityProvider: `${this.#config.providerUrl}/login#authorize`,
      permissions: [PermissionsType.identity, PermissionsType.wallet],
      ledgerCanisterId: this.#config.ledgerCanisterId,
      onAuthenticated: (icInstance: IC) => {
        this.#ic = window.ic.astrox ?? icInstance
        this.#principal = this.#ic.principal.toText()
        this.#identity = this.#ic.identity
        // this.#address = this.#ic.wallet
      },
    })
  }

  async disconnect() {
    await this.#ic.disconnect()
  }

  requestTransfer(...args) {
    return this.#ic.requestTransfer(...args)
  }

  queryBalance(...args) {
    return this.#ic.queryBalance(...args)
  }

  signMessage(...args) {
    return this.#ic.signMessage(...args)
  }

  // // getManagementCanister: (...args) => thisIC.getManagementCanister(...args),
  // // callClientRPC: (...args) => thisIC.callClientRPC(...args),
  // // requestBurnXTC: (...args) => thisIC.requestBurnXTC(...args),
  // // batchTransactions: (...args) => thisIC.batchTransactions(...args),
}

export default AstroXConnector