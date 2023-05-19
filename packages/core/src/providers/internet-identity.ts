import { AuthClient } from "@dfinity/auth-client"
import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent"
import type { Identity } from "@dfinity/agent"
import type { IConnector } from "./connectors"
// @ts-ignore
import dfinityLogoLight from "../assets/dfinity.svg"
// @ts-ignore
import dfinityLogoDark from "../assets/dfinity.svg"
import { IDL } from "@dfinity/candid"
import {
  ConnectError,
  CreateActorError,
  DisconnectError,
  InitError,
  IWalletConnector,
  PROVIDER_STATUS,
} from "./connectors"
import { Methods } from "./connectors"

class InternetIdentity implements IConnector {

  public meta = {
    features: [],
    icon: {
      light: dfinityLogoLight,
      dark: dfinityLogoDark,
    },
    id: "ii",
    name: "Internet Identity",
    description: "Internet Identity is the identity provider for the Internet Computer.",
    deepLinks: {
      android: "intent://APP_HOST/#Intent;scheme=APP_NAME;package=APP_PACKAGE;end",
      ios: "astroxme://",
    },
    methods: [Methods.BROWSER],
  }

  #config: {
    whitelist: Array<string>
    host: string
    providerUrl: string
    dev: boolean
  }
  #identity?: Identity
  #principal?: string
  #client?: AuthClient
  #wallets: Array<IWalletConnector> = []

  get wallets() {
    return this.#wallets
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
      providerUrl: "https://identity.ic0.app",
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

  get identity() {
    return this.#identity
  }

  async init() {
    try {
      this.#client = await AuthClient.create()
      const isConnected = await this.isConnected()
      if (isConnected) {
        this.#identity = this.#client.getIdentity()
        this.#principal = this.#identity?.getPrincipal().toString()
      }
      return { isConnected }
    } catch (e) {
      throw new Error({ kind: InitError.InitFailed, error: e })
    }
  }

  async isConnected(): Promise<boolean> {
    try {
      if (!this.#client) {
        return false
      }
      return await this.#client!.isAuthenticated()
    } catch (e) {
      console.error(e)
      return false
    }
  }

  async status() {
    try {
      if (!this.#client) {
        return PROVIDER_STATUS.IDLE
      }
      return await this.#client.isAuthenticated() ? PROVIDER_STATUS.CONNECTED : PROVIDER_STATUS.IDLE
    } catch (e) {
      console.error(e)
      return PROVIDER_STATUS.IDLE
    }
  }

  async createActor<Service>(canisterId, idlFactory) {
    // TODO: pass identity?
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

  async connect() {
    try {
      await new Promise<void>((resolve, reject) => {
        this.#client?.login({
          // TODO: local
          identityProvider: this.#config.providerUrl,
          onSuccess: resolve,
          onError: reject,
        })
      })
      const identity = this.#client?.getIdentity()
      const principal = identity?.getPrincipal().toString()
      this.#identity = identity
      this.#principal = principal
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
  InternetIdentity,
}
