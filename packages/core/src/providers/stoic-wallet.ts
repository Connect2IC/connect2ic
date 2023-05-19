import { StoicIdentity } from "ic-stoic-identity"
import { Actor, HttpAgent } from "@dfinity/agent"
import type { IConnector } from "./connectors"
import {
  ConnectError,
  CreateActorError,
  DisconnectError,
  InitError,
  IWalletConnector,
  Methods,
  PROVIDER_STATUS,
} from "./connectors"
// @ts-ignore
import stoicLogoLight from "../assets/stoic.png"
import { IDL } from "@dfinity/candid"

// class Wallet implements IWalletConnector {
//   constructor() {
//   }
//
// }

class StoicWallet implements IConnector {

  public meta = {
    features: [],
    icon: {
      light: stoicLogoLight,
      dark: stoicLogoLight,
    },
    id: "stoic",
    name: "Stoic Wallet",
    description: "Stoic Wallet by Toniq Labs",
    deepLinks: {
      android: "intent://APP_HOST/#Intent;scheme=APP_NAME;package=APP_PACKAGE;end",
      ios: "astroxme://",
    },
    methods: [Methods.BROWSER],
  }
  #wallets: Array<IWalletConnector> = []

  #config: {
    whitelist: Array<string>
    providerUrl: string
    host: string
    dev: boolean
  }
  #identity?: any
  #principal?: string

  get wallets() {
    return this.#wallets
  }

  get identity() {
    return this.#identity
  }

  get principal() {
    return this.#principal
  }

  constructor(userConfig = {}) {
    this.#config = {
      whitelist: [],
      host: window.location.origin,
      providerUrl: "https://www.stoicwallet.com",
      dev: true,
      ...userConfig,
    }
  }

  set config(config) {
    this.#config = { ...this.#config, ...config }
  }

  get config() {
    return this.#config
  }

  async init() {
    try {
      const identity = await StoicIdentity.load(this.#config.providerUrl)
      const isConnected = !!identity
      if (isConnected) {
        this.#identity = identity
        this.#principal = identity.getPrincipal().toText()
      }
      return { isConnected }
    } catch (e) {
      throw new Error({ kind: InitError.InitFailed, error: e })
    }
  }

  async createActor<Service>(canisterId: string, idlFactory: IDL.InterfaceFactory) {
    // TODO: allow passing identity?
    const agent = new HttpAgent({
      ...this.#config,
      identity: this.#identity,
    })
    try {
      if (this.#config.dev) {
        // Fetch root key for certificate validation during development
        await agent.fetchRootKey()
      }
    } catch (e) {
      throw new Error({ kind: CreateActorError.FetchRootKeyFailed, error: e })
    }
    try {
      // TODO: add actorOptions?
      const actor = Actor.createActor<Service>(idlFactory, {
        agent,
        canisterId,
      })
      return actor
    } catch (e) {
      throw new Error({ kind: CreateActorError.CreateActorFailed, error: e })
    }
  }

  async isConnected() {
    try {
      const identity = await StoicIdentity.load()
      return !!identity
    } catch (e) {
      console.error(e)
      return false
    }
  }

  async status() {
    try {
      const identity = await StoicIdentity.load()
      return !!identity ? PROVIDER_STATUS.CONNECTED : PROVIDER_STATUS.IDLE
    } catch (e) {
      console.error(e)
      return PROVIDER_STATUS.IDLE
    }
  }

  async connect() {
    try {
      this.#identity = await StoicIdentity.connect()
      this.#principal = this.#identity.getPrincipal().toText()
      return true
    } catch (e) {
      throw new Error({ kind: ConnectError.ConnectFailed, error: e })
    }
  }

  async disconnect() {
    try {
      await StoicIdentity.disconnect()
      return true
    } catch (e) {
      throw new Error({ kind: DisconnectError.DisconnectFailed, error: e })
    }
  }
}

export {
  StoicWallet,
}
