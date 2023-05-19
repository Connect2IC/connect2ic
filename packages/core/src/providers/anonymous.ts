import { AuthClient } from "@dfinity/auth-client"
import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent"
import type { Identity } from "@dfinity/agent"
import type { CreateActorResult, IConnector } from "./connectors"
// @ts-ignore
import dfinityLogoLight from "../assets/dfinity.svg"
// @ts-ignore
import dfinityLogoDark from "../assets/dfinity.svg"
import { IDL } from "@dfinity/candid"
import { ConnectError, CreateActorError, DisconnectError, InitError, PROVIDER_STATUS } from "./connectors"
import { ECDSAKeyIdentity } from "@dfinity/identity"

class Anonymous implements IConnector {

  public meta = {
    icon: {
      light: dfinityLogoLight,
      dark: dfinityLogoDark,
    },
    methods: [],
    description: "Anonymous identity",
    // deepLinks: { android: string, ios: string }
    id: "anonymous",
    name: "Anonymous",
  }

  #config: {
    whitelist: Array<string>
    host: string
    dev: boolean
  }
  #identity?: Identity
  #agent?: HttpAgent
  #principal?: string
  #client?: AuthClient

  get principal() {
    return this.#principal
  }

  get client() {
    return this.#client
  }

  get wallets() {
    return []
  }

  constructor(userConfig = {}) {
    this.#config = {
      whitelist: [],
      host: "https://ic0.app",
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
      this.#identity = await ECDSAKeyIdentity.generate()
      this.#agent = new HttpAgent({ host: this.#config.host, identity: this.#identity })
      this.#principal = this.#identity.getPrincipal().toString()
    } catch (e) {
      throw new Error({ kind: InitError.InitFailed, error: e })
    }
    if (this.#config.dev) {
      try {
        await this.#agent.fetchRootKey()
      } catch (e) {
        throw new Error({ kind: InitError.FetchRootKeyFailed, error: e })
      }
    }
    const isConnected = true
    return { isConnected }
  }

  async isConnected(): Promise<boolean> {
    try {
      if (!this.#identity) {
        return false
      }
      return true
    } catch (e) {
      return false
    }
  }

  async status() {
    try {
      if (!this.#identity) {
        return PROVIDER_STATUS.IDLE
      }
      return PROVIDER_STATUS.CONNECTED
    } catch (e) {
      console.error(e)
      return PROVIDER_STATUS.IDLE
    }
  }

  async createActor<Service>(canisterId, idlFactory, config = {}) {
    try {
      if (!this.#agent) {
        throw new Error({ kind: CreateActorError.NotInitialized })
      }
      const actor = Actor.createActor<Service>(idlFactory, {
        agent: this.#agent,
        canisterId,
        ...config,
      })
      return actor
    } catch (e) {
      throw new Error({ kind: CreateActorError.CreateActorFailed, error: e })
    }
  }

  async connect() {
    try {
      // TODO: check client
      return true
    } catch (e) {
      throw new Error({ kind: ConnectError.ConnectFailed, error: e })
    }
  }

  async disconnect() {
    try {
      await this.#client?.logout()
      return true
    } catch (e) {
      throw new Error({ kind: DisconnectError.DisconnectFailed, error: e })
    }
  }
}

export {
  Anonymous,
}
