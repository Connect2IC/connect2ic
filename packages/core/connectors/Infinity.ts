import { IConnector, IWalletConnector } from "./connectors"

class InfinityConnector implements IConnector, IWalletConnector {

  static readonly id = "infinity"
  readonly id = "infinity"
  readonly name = "Infinity Wallet"

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
      // TODO: Fix CORS error: Access to fetch at 'https://testnet.infinityswap.one/api/v2/status'
      host: window.location.origin,
      dev: false,
      ...userConfig,
    }
    this.#ic = window.ic.infinityWallet
  }

  async init() {
    const isAuthenticated = await this.isAuthenticated()
    if (isAuthenticated) {
      try {
        // await window.ic.infinityWallet.createAgent(this.#config)
        // TODO: never finishes if user doesnt login back?
        this.#principal = await (await window.ic.infinityWallet.getPrincipal()).toString()
        // const walletAddress = thisIC.wallet
      } catch (e) {
        console.error(e)
      }
    }
  }

  async isAuthenticated() {
    // TODO: no window
    return await window.ic.infinityWallet.isConnected()
  }

  async createActor(canisterId, idlFactory) {
    // Fetch root key for certificate validation during development
    if (this.#config.dev) {
      await window.ic.infinityWallet.agent.fetchRootKey()
    }

    return await window.ic.infinityWallet.createActor({ canisterId, interfaceFactory: idlFactory })
  }


  async connect() {
    if (!window.ic.infinityWallet) {
      window.open("https://chrome.google.com/webstore/detail/infinity-wallet/jnldfbidonfeldmalbflbmlebbipcnle", "_blank")
      // TODO: throw?
      return
    }
    try {
      await window.ic.infinityWallet.requestConnect(this.#config)
      this.#principal = await (await this.#ic.getPrincipal()).toString()
      // const walletAddress = thisIC.wallet
    } catch
      (e) {
      // TODO: handle
      return
    }
  }

  async disconnect() {
    await window.ic.infinityWallet.disconnect()
    // TODO: reset state?
  }

  // address: walletAddress

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

export default InfinityConnector