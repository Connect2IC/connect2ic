import { StoicIdentity } from "ic-stoic-identity"
import { Actor, HttpAgent } from "@dfinity/agent"
import { IConnector } from "./connectors"

class Stoic implements IConnector {
  readonly id = "stoic"
  readonly name = "Stoic Wallet"
  #config: {
    whitelist: [string],
    host: string,
    dev: Boolean,
  }
  #identity?: any
  #principal?: string
  #client?: any

  constructor(userConfig) {
    this.#config = {
      whitelist: [],
      host: window.location.origin,
      dev: false,
      ...userConfig,
    }
  }

  async init() {
    let identity = await StoicIdentity.load()

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
    return await this.#client.isAuthenticated()
  }

  async connect() {
    this.#identity = await StoicIdentity.connect()
    this.#principal = this.#identity.getPrincipal().toText()
  }

  async disconnect() {
    await StoicIdentity.disconnect()
  }
}

export default Stoic