import { StoicIdentity } from "ic-stoic-identity"
import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent"
import type { IConnector } from "./connectors"
// @ts-ignore
import stoicLogoLight from "../assets/stoic.png"
// @ts-ignore
import stoicLogoDark from "../assets/stoic.png"
import { IDL } from "@dfinity/candid"

class StoicConnector implements IConnector {

  #config: {
    whitelist: Array<string>,
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
    return true
  }

  async createActor<Service>(canisterId: string, idlFactory: IDL.InterfaceFactory): Promise<ActorSubclass<Service> | undefined> {
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
    return true
  }

  async disconnect() {
    await StoicIdentity.disconnect()
    return true
  }
}

export const StoicWallet = {
  connector: StoicConnector,
  icon: {
    light: stoicLogoLight,
    dark: stoicLogoDark,
  },
  id: "stoic",
  name: "Stoic Wallet",
}