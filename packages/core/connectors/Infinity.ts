import { IConnector, IWalletConnector } from "./connectors"

class InfinityConnector implements IConnector, IWalletConnector {

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

  constructor(userConfig = {}) {
    this.#config = {
      whitelist: [],
      host: window.location.origin,
      dev: false,
      ...userConfig,
    }
    this.#ic = window.ic?.infinityWallet
  }

  async init() {
    if (!this.#ic) {
      throw Error("Not supported")
    }
    const isConnected = await this.isConnected()
    if (isConnected) {
      // Otherwise agent doesn't become available. Infinity wallet should fix
      await this.connect()
      try {
        // TODO: never finishes if user doesnt login back?
        this.#principal = await (await this.#ic.getPrincipal()).toString()
        // const walletAddress = thisIC.wallet
      } catch (e) {
        console.error(e)
      }
    }
  }

  async isConnected() {
    // TODO: no window
    return await this.#ic?.isConnected()
  }

  async createActor(canisterId, idlFactory) {
    // Fetch root key for certificate validation during development
    if (this.#config.dev) {
      await this.#ic?.agent.fetchRootKey()
    }

    return await this.#ic?.createActor({ canisterId, interfaceFactory: idlFactory })
  }


  async connect() {
    if (!this.#ic) {
      window.open("https://chrome.google.com/webstore/detail/infinity-wallet/jnldfbidonfeldmalbflbmlebbipcnle", "_blank")
      throw Error("Not installed")
    }
    try {
      await this.#ic.requestConnect(this.#config)
      this.#principal = await (await this.#ic.getPrincipal()).toString()
      // const walletAddress = thisIC.wallet
    } catch
      (e) {
      // TODO: handle
      return
    }
  }

  async disconnect() {
    await Promise.race([
      new Promise((resolve, reject) => {
        // InfinityWallet disconnect promise never resolves despite being disconnected
        // This is a hacky workaround
        setTimeout(async () => {
          const isConnected = await this.#ic.isConnected()
          if (!isConnected) {
            resolve(isConnected)
          } else {
            reject()
          }
        }, 0)
      }),
      this.#ic.disconnect(),
    ])
  }

  async requestTransfer(...args) {
    // return this.#ic.requestTransfer(...args)
  }

  async queryBalance(...args) {
    return this.#ic.requestBalance(...args)
  }

  async signMessage(...args) {
    return this.#ic.signMessage(...args)
  }
  //
  // getManagementCanister(...args) {
  //   return this.#ic.getManagementCanister(...args)
  // }

  batchTransactions(...args) {
    return this.#ic.batchTransactions(...args)
  }
}

export default InfinityConnector