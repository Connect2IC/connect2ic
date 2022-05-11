import type { IConnector, IWalletConnector } from "./connectors"
import plugLogoLight from "../assets/plugLight.svg"
import plugLogoDark from "../assets/plugDark.svg"

class PlugConnector implements IConnector, IWalletConnector {

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
    this.#ic = window.ic?.plug
  }

  async init() {
    if (!this.#ic) {
      throw Error("Not supported")
    }
    const isConnected = await this.isConnected()
    if (isConnected) {
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

  async isConnected() {
    // TODO: no window
    return await this.#ic?.isConnected()
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
    if (!this.#ic) {
      window.open("https://plugwallet.ooo/", "_blank")
      throw Error("Not installed")
    }
    try {
      await this.#ic.requestConnect(this.#config)
      this.#principal = await (await this.#ic.getPrincipal()).toString()
    } catch (e) {
      throw e
    }
  }

  async disconnect() {
    // TODO: should be awaited but never finishes, tell Plug to fix
    this.#ic.disconnect()
  }

  address() {
    return {
      principal: this.#principal,
      // accountId: this.#ic.accountId,
    }
  }

  requestTransfer(args) {
    return this.#ic.requestTransfer({
      ...args,
      amount: args.amount * 100000000,
    })
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

export const PlugWallet = {
  connector: PlugConnector,
  icon: {
    light: plugLogoLight,
    dark: plugLogoDark,
  },
  id: "plug",
  name: "Plug Wallet",
}