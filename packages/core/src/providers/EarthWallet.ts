import type { IConnector, IWalletConnector } from "./connectors"
import { IDL } from "@dfinity/candid"
import earthLogoLight from "../assets/earth.png"
import earthLogoDark from "../assets/earth.png"

class EarthWalletConnector implements IConnector, IWalletConnector {

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
    // TODO: not available
    this.#ic = window.earth
  }

  async init() {
    const isConnected = await this.isConnected()
    if (isConnected) {
      try {
        // TODO: never finishes if user doesnt login back?
        const {
          principalId,
        } = await this.#ic.getAddressMeta()
        this.#principal = principalId
      } catch (e) {
        console.error(e)
      }
    }
  }

  async isConnected() {
    // TODO: no window
    const { connected } = await window.earth.isConnected()
    return connected
    // return await this.#ic.isConnected()
  }

  async createActor(canisterId, idlFactory) {
    // Fetch root key for certificate validation during development
    if (this.#config.dev) {
      // await this.#ic.agent.fetchRootKey()
    }
    const ic = this.#ic
    // TODO: emulate Actor?
    const service = idlFactory({ IDL })
    console.log({ service })
    // const call = (method, args) => {
    //   ic.sign({
    //     canisterId,
    //     method,
    //     args,
    //   })
    // }
    // return {}
    // return await this.#ic.createActor({ canisterId, interfaceFactory: idlFactory })
  }


  async connect() {
    this.#ic = window.earth
    if (!this.#ic) {
      window.open("https://www.earthwallet.io/", "_blank")
      // TODO: throw?
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
    return
  }

  async requestTransfer(...args) {
    return this.#ic.request(...args)
  }

  async queryBalance(...args) {
    // return this.#ic.requestBalance(...args)
    return []
  }

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

export default {
  connector: EarthWalletConnector,
  icon: {
    light: earthLogoLight,
    dark: earthLogoDark,
  },
  id: "earth",
  name: "Earth Wallet",
}