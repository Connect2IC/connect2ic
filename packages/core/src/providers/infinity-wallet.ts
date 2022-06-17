import type { IConnector, IWalletConnector } from "./connectors"
import type { ActorSubclass, Agent, Identity } from "@dfinity/agent"
import type { IDL } from "@dfinity/candid"
// @ts-ignore
import infinityLogoLight from "../assets/infinity.png"
// @ts-ignore
import infinityLogoDark from "../assets/infinity.png"
import type { Principal } from "@dfinity/principal"

type Config = {
  whitelist: Array<string>,
  host: string,
  dev: Boolean,
}

type IC = {
  createActor: <T>(args: { canisterId: string, interfaceFactory: IDL.InterfaceFactory }) => Promise<ActorSubclass<T>>
  agent: Agent
  getPrincipal: () => Promise<Principal>
  isConnected: () => Promise<boolean>
  disconnect: () => Promise<any>
  requestConnect: (Config) => Promise<boolean>
}

class InfinityConnector implements IConnector {

  #config: Config
  #identity?: any
  #principal?: string
  #client?: any
  #ic?: IC

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
        this.#principal = (await this.#ic.getPrincipal()).toString()
        // const walletAddress = thisIC.wallet
      } catch (e) {
        console.error(e)
      }
    }
    return true
  }

  async isConnected() {
    return this.#ic ? this.#ic!.isConnected() : false
  }

  async createActor<Service>(canisterId: string, idlFactory: IDL.InterfaceFactory): Promise<ActorSubclass<Service> | undefined> {
    // Fetch root key for certificate validation during development
    if (this.#config.dev) {
      await this.#ic?.agent.fetchRootKey()
    }

    return this.#ic?.createActor({ canisterId, interfaceFactory: idlFactory })
  }


  async connect() {
    if (!this.#ic) {
      window.open("https://chrome.google.com/webstore/detail/infinity-wallet/jnldfbidonfeldmalbflbmlebbipcnle", "_blank")
      throw Error("Not installed")
    }
    try {
      await this.#ic.requestConnect(this.#config)
      this.#principal = (await this.#ic.getPrincipal()).toString()
      return true
      // const walletAddress = thisIC.wallet
    } catch
      (e) {
      // TODO: handle
      return false
    }
  }

  async disconnect() {
    await Promise.race([
      new Promise((resolve, reject) => {
        // InfinityWallet disconnect promise never resolves despite being disconnected
        // This is a hacky workaround
        setTimeout(async () => {
          const isConnected = await this.#ic?.isConnected()
          if (!isConnected) {
            resolve(isConnected)
          } else {
            reject()
          }
        }, 10)
      }),
      this.#ic?.disconnect(),
    ])
    return true
  }

  // async requestTransfer(...args) {
  //   // return this.#ic.requestTransfer(...args)
  // }

  // async queryBalance(...args) {
  //   return this.#ic.requestBalance(...args)
  // }

  // async signMessage(...args) {
  //   return this.#ic.signMessage(...args)
  // }

  //
  // getManagementCanister(...args) {
  //   return this.#ic.getManagementCanister(...args)
  // }

  // batchTransactions(...args) {
  //   return this.#ic.batchTransactions(...args)
  // }
}

export const InfinityWallet = {
  connector: InfinityConnector,
  icon: {
    light: infinityLogoLight,
    dark: infinityLogoDark,
  },
  id: "infinity",
  name: "Infinity Wallet",
}