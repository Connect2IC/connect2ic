import { AuthClient } from "@dfinity/auth-client"
import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent"
import type { IConnector } from "./connectors"
// @ts-ignore
import nfidLogoLight from "../assets/nfid.png"
// @ts-ignore
import nfidLogoDark from "../assets/nfid.png"
import { IDL } from "@dfinity/candid"

class NFID implements IConnector {

  public meta = {
    features: [],
    icon: {
      light: nfidLogoLight,
      dark: nfidLogoDark,
    },
    id: "nfid",
    name: "NFID",
  }

  #config: {
    whitelist: Array<string>,
    appName: string,
    host: string,
    providerUrl: string,
    dev: Boolean,
  }
  #identity?: any
  #principal?: string
  #client?: any

  get identity() {
    return this.#identity
  }

  get principal() {
    return this.#principal
  }

  get client() {
    return this.#client
  }

  constructor(userConfig = {}) {
    this.#config = {
      whitelist: [],
      host: window.location.origin,
      providerUrl: "https://nfid.one",
      appName: "my-ic-app",
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
    // TODO: pass in config or not?
    this.#client = await AuthClient.create()
    const isAuthenticated = await this.isConnected()
    if (isAuthenticated) {
      this.#identity = this.#client.getIdentity()
      this.#principal = this.#identity.getPrincipal().toString()
    }
    return true
  }

  async isConnected() {
    return await this.#client.isAuthenticated()
  }

  async createActor<Service>(canisterId: string, idlFactory: IDL.InterfaceFactory): Promise<ActorSubclass<Service> | undefined> {
    // TODO: pass identity?
    const agent = new HttpAgent({
      ...this.#config,
      identity: this.#identity,
    })

    if (this.#config.dev) {
      // Fetch root key for certificate validation during development
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

  async connect() {
    await new Promise((resolve, reject) => {
      this.#client.login({
        // TODO: local
        identityProvider: this.#config.providerUrl + `/authenticate/?applicationName=${this.#config.appName}`,
        onSuccess: resolve,
        onError: reject,
      })
    })
    const identity = this.#client.getIdentity()
    const principal = identity.getPrincipal().toString()
    this.#identity = identity
    this.#principal = principal
    return true
  }

  async disconnect() {
    await this.#client.logout()
    return true
  }
}

export {
  NFID
}