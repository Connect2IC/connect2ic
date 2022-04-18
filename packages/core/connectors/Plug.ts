import { IConnector, IWalletConnector } from "./connectors"

class PlugConnector implements IConnector, IWalletConnector {

  static readonly id = "plug"
  readonly id = "plug"
  readonly name = "Plug Wallet"

  #config: {
    whitelist: [string],
    host: string,
    dev: Boolean,
  }
  #identity?: any
  #principal?: string
  #client?: any
  #ic?: any

  get identity() {
    return this.#identity
  }

  get principal() {
    return this.#principal
  }

  get client() {
    return this.#client
  }

  get ic() {
    return this.#ic
  }

  constructor(userConfig) {
    this.#config = {
      whitelist: [],
      host: window.location.origin,
      dev: false,
      ...userConfig,
    }
    this.#ic = window.ic.plug
  }

  async init() {
    const isAuthenticated = await this.isAuthenticated()
    if (isAuthenticated) {
      try {
        await this.#ic.createAgent(this.#config)
        // TODO: never finishes if user doesnt login back?
        this.#principal = await (await this.#ic.getPrincipal()).toString()
        // TODO: return identity?
        // const walletAddress = thisIC.wallet
      } catch (e) {
        console.error(e)
      }
    }
  }

  async isAuthenticated() {
    // TODO: no window
    return await this.#ic.isConnected()
  }

  async createActor(canisterId, idlFactory) {
    // Fetch root key for certificate validation during development
    if (this.#config.dev) {
      await this.#ic.agent.fetchRootKey()
    }

    return await this.#ic.createActor({ canisterId, interfaceFactory: idlFactory })
  }

  // TODO: handle Plug account switching
  async connect() {
    try {
      await this.#ic.requestConnect(this.#config)
      this.#principal = await (await this.#ic.getPrincipal()).toString()
      // const walletAddress = thisIC.wallet
    } catch
      (e) {
      // TODO: handle
      throw e
    }
    if (!this.#ic) {
      window.open("https://plugwallet.ooo/", "_blank")
      // TODO: throw?
      return
    }
  }

  async disconnect() {
    await this.#ic.disconnect()
    // TODO: reset state?
  }

  address() {
    return {
      principal: this.#principal,
      // accountId: this.#ic.accountId,
    }
  }

  requestTransfer(...args) {
    return this.#ic.requestTransfer(...args)
  }

  queryBalance(...args) {
    return this.#ic.requestBalance(...args)
  }

  signMessage(...args) {
    return this.#ic.signMessage(...args)
  }

  getManagementCanister(...args) {
    return this.#ic.getManagementCanister(...args)
  }

  callClientRPC(...args) {
    return this.#ic.callClientRPC(...args)
  }

  requestBurnXTC(...args) {
    return this.#ic.requestBurnXTC(...args)
  }

  batchTransactions(...args) {
    return this.#ic.batchTransactions(...args)
  }
}

export default PlugConnector