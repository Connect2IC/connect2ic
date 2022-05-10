import { StoicIdentity } from "ic-stoic-identity"
import { Actor, HttpAgent } from "@dfinity/agent"
import type { IConnector } from "./connectors"
import stoicLogoLight from "../assets/stoic.png"
import stoicLogoDark from "../assets/stoic.png"

class StoicConnector implements IConnector {

  #config: {
    whitelist: [string],
    providerUrl: string,
    host: string,
    dev: Boolean,
  }
  #identity?: any
  #principal?: string

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
      dev: false,
      ...userConfig,
    }
  }

  async init() {
    const identity = await StoicIdentity.load(this.#config.providerUrl)

    if (identity) {
      this.#identity = identity
      this.#principal = identity.getPrincipal().toText()
    }
  }

  async createActor(canisterId, idlFactory) {
    // TODO: pass identity
    const agent = new HttpAgent({
      ...this.#config,
      identity: this.#identity,
    })

    // Fetch root key for certificate validation during development
    if (this.#config.dev) {
      agent.fetchRootKey().catch(err => {
        console.warn("Unable to fetch root key. Check to ensure that your local replica is running")
        console.error(err)
      })
    }

    // TODO: add actorOptions?
    return Actor.createActor(idlFactory, {
      agent,
      canisterId,
    })
  }

  async isConnected() {
    const identity = await StoicIdentity.load()
    return !!identity
  }

  async connect() {
    this.#identity = await StoicIdentity.connect()
    this.#principal = this.#identity.getPrincipal().toText()
  }

  async disconnect() {
    await StoicIdentity.disconnect()
  }
}

export default {
  connector: StoicConnector,
  icon: {
    light: stoicLogoLight,
    dark: stoicLogoDark,
  },
  id: "stoic",
  name: "Stoic Wallet",
}