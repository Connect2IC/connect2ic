import { IConnector, IWalletConnector } from "./connectors"

class PlugConnector implements IConnector, IWalletConnector {
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
        await window.ic.plug.createAgent(this.#config)
        // TODO: never finishes if user doesnt login back?
        this.#principal = await (await window.ic.plug.getPrincipal()).toString()
        // TODO: return identity?
        // const walletAddress = thisIC.wallet
      } catch (e) {
        console.error(e)
      }
    }
  }

  async isAuthenticated() {
    // TODO: no window
    return await window.ic.plug.isConnected()
  }

  async createActor(canisterId, idlFactory) {
    // Fetch root key for certificate validation during development
    if (this.#config.dev) {
      await window.ic.plug.agent.fetchRootKey()
    }

    return await window.ic.plug.createActor({ canisterId, interfaceFactory: idlFactory })
  }


  async connect() {
    try {
      await window.ic.plug.requestConnect(this.#config)
      this.#principal = await (await this.#ic.getPrincipal()).toString()
      // const walletAddress = thisIC.wallet
    } catch
      (e) {
      // TODO: handle
      return
    }
    if (!window.ic.plug) {
      window.open("https://plugwallet.ooo/", "_blank")
      // TODO: throw?
      return
    }
  }

  async disconnect() {
    await window.ic.plug.disconnect()
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

export default PlugConnector