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
  ok,
  err,
} from "neverthrow"
import { ConnectError, CreateActorError, DisconnectError, InitError } from "./connectors"
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
      ios: "astroxme://"
    },
    methods: [Methods.BROWSER]
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
      return ok({ isConnected })
    } catch (e) {
      console.error(e)
      return err({ kind: InitError.InitFailed })
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

  async createActor<Service>(canisterId, idlFactory) {
    try {
      // TODO: pass identity?
      const agent = new HttpAgent({
        ...this.#config,
        identity: this.#identity,
      })

      if (this.#config.dev) {
        // Fetch root key for certificate validation during development
        // Fetch root key for certificate validation during development
        const res = await agent.fetchRootKey().then(() => ok(true)).catch(e => err({ kind: CreateActorError.FetchRootKeyFailed }))
        if (res.isErr()) {
          return res
        }
      }
      // TODO: add actorOptions?
      const actor = Actor.createActor<Service>(idlFactory, {
        agent,
        canisterId,
      })
      return ok(actor)
    } catch (e) {
      console.error(e)
      return err({ kind: CreateActorError.CreateActorFailed })
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
      return ok(true)
    } catch (e) {
      console.error(e)
      return err({ kind: ConnectError.ConnectFailed })
    }
  }

  async disconnect() {
    try {
      await this.#client?.logout()
      return ok(true)
    } catch (e) {
      console.error(e)
      return err({ kind: DisconnectError.DisconnectFailed })
    }
  }
}

export {
  InternetIdentity,
}