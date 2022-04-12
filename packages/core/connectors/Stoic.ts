import { StoicIdentity } from "ic-stoic-identity"
import { Actor, HttpAgent } from "@dfinity/agent"
import { IConnector } from "./connectors"

class StoicConnector implements IConnector {

  static readonly id = "stoic"
  readonly id = "stoic"
  readonly name = "Stoic Wallet"

  #config: {
    whitelist: [string],
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

  constructor(userConfig) {
    this.#config = {
      whitelist: [],
      host: window.location.origin,
      dev: false,
      ...userConfig,
    }
  }

  async init() {
    const identity = await StoicIdentity.load()

    if (identity) {
      this.#identity = identity
      this.#principal = identity.getPrincipal().toText()
    }
  }

  async createActor(canisterId, idlFactory) {
    // TODO: pass identity
    const agent = new HttpAgent({ ...this.#config })

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

  async isAuthenticated() {
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

export default StoicConnector