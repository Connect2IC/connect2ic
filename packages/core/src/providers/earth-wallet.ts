import type { IConnector, IWalletConnector } from "./connectors"
import { IDL } from "@dfinity/candid"
// @ts-ignore
import earthLogoLight from "../assets/earth.png"
// @ts-ignore
import earthLogoDark from "../assets/earth.png"
import { ActorSubclass } from "@dfinity/agent"

class EarthWallet implements IConnector, IWalletConnector {

  public meta = {
    features: [],
    icon: {
      light: earthLogoLight,
      dark: earthLogoDark,
    },
    id: "earth",
    name: "Earth Wallet",
    methods: ["extension"],
  }

  #config: {
    whitelist: Array<string>,
    host: string,
    dev: Boolean,
  }
  #identity?: any
  #principal?: string
  #ic?: any

  get identity() {
    return this.#identity
  }

  get principal() {
    return this.#principal
  }

  get ic() {
    return this.#ic
  }

  constructor(userConfig = {}) {
    this.#config = {
      whitelist: [],
      host: window.location.origin,
      dev: true,
      ...userConfig,
    }
    // TODO: not available
    this.#ic = window.earth
  }

  set config(config) {
    this.#config = { ...this.#config, ...config }
  }

  get config() {
    return this.#config
  }

  async init() {
    // const isConnected = await this.isConnected()
    const isConnected = false
    if (isConnected) {
      try {
        const {
          principalId,
        } = await this.#ic.getAddressMeta()
        this.#principal = principalId
      } catch (e) {
        console.error(e)
      }
    }
    return true
  }

  async isConnected() {
    // TODO: no window
    return false
    // const { connected } = await window.earth.isConnected()
    // return connected
    // return await this.#ic.isConnected()
  }

  async createActor<Service>(canisterId: string, idlFactory: IDL.InterfaceFactory): Promise<ActorSubclass<Service> | undefined> {
    // Fetch root key for certificate validation during development
    if (this.#config.dev) {
      // await this.#ic.agent.fetchRootKey()
    }
    // const service = idlFactory({ IDL })
    const proxy = new Proxy({}, {
      get(target, method, receiver) {
        return async (...args) => {
          const response = await window.earth.sign({
            canisterId,
            method,
            args,
          })
          return response
        }
      },
    })

    return proxy
  }


  async connect() {
    this.#ic = window.earth
    if (!this.#ic) {
      window.open("https://www.earthwallet.io/", "_blank")
      throw Error("Not installed")
    }
    try {
      await this.#ic.connect(this.#config)
      const {
        principalId,
      } = await this.#ic.getAddressMeta()
      this.#principal = principalId
    } catch (e) {
      // TODO: handle
      throw e
    }
  }

  async disconnect() {
    // Not available
    return true
  }

  // async requestTransfer(...args) {
  //   return this.#ic.request(...args)
  // }

  // async queryBalance(...args) {
  //   // return this.#ic.requestBalance(...args)
  //   return []
  // }

  // signMessage(...args) {
  //   return this.#ic.signMessage(...args)
  // }
  //
  // getManagementCanister(...args) {
  //   return this.#ic.getManagementCanister(...args)
  // }
  //
  // batchTransactions(...args) {
  //   return this.#ic.batchTransactions(...args)
  // }
}

export {
  EarthWallet,
}