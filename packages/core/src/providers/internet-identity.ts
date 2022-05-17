import { AuthClient } from "@dfinity/auth-client"
import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent"
import type { Identity } from "@dfinity/agent"
import type { IConnector } from "./connectors"
// @ts-ignore
import dfinityLogoLight from "../assets/dfinity.svg"
// @ts-ignore
import dfinityLogoDark from "../assets/dfinity.svg"
import { IDL } from "@dfinity/candid"

class InternetIdentityConnector implements IConnector {

  #config: {
    whitelist: Array<string>,
    host: string,
    providerUrl: string,
    dev: boolean,
  }
  #identity?: Identity
  #principal?: string
  #client?: AuthClient

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
      providerUrl: "https://identity.ic0.app",
      dev: false,
      ...userConfig,
    }
  }

  async init() {
    this.#client = await AuthClient.create()
    const isConnected = await this.isConnected()
    // // TODO: fix?
    if (isConnected) {
      this.#identity = this.#client.getIdentity()
      this.#principal = this.#identity?.getPrincipal().toString()
    }
    return true
  }

  async isConnected(): Promise<boolean> {
    return await this.#client!.isAuthenticated()
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
      this.#client?.login({
        // TODO: local
        identityProvider: this.#config.providerUrl,
        onSuccess: () => resolve(true),
        onError: reject,
      })
    })
    const identity = this.#client?.getIdentity()
    const principal = identity?.getPrincipal().toString()
    this.#identity = identity
    this.#principal = principal
    return true
  }

  async disconnect() {
    await this.#client?.logout()
    return true
  }
}

export const InternetIdentity = {
  connector: InternetIdentityConnector,
  icon: {
    light: dfinityLogoLight,
    dark: dfinityLogoDark,
  },
  id: "ii",
  name: "Internet Identity",
}