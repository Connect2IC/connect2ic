import { AuthClient } from "@dfinity/auth-client"
import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent"
import type { IConnector } from "./connectors"
// @ts-ignore
import nfidLogoLight from "../assets/nfid.png"
// @ts-ignore
import nfidLogoDark from "../assets/nfid.png"
import { IDL } from "@dfinity/candid"
import {
  ok,
  err,
} from "neverthrow"
import { ConnectError, CreateActorError, DisconnectError, InitError } from "./connectors"

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
    try {
      // TODO: pass in config or not?
      this.#client = await AuthClient.create()
      const isConnected = await this.isConnected()
      if (isConnected) {
        this.#identity = this.#client.getIdentity()
        this.#principal = this.#identity.getPrincipal().toString()
      }
      return ok({ isConnected })
    } catch (e) {
      console.error(e)
      return err({ kind: InitError.InitFailed })
    }
  }

  async isConnected() {
    try {
      if (!this.#client) {
        return false
      }
      return await this.#client.isAuthenticated()
    } catch (e) {
      console.error(e)
      return false
    }
  }

  async createActor<Service>(canisterId: string, idlFactory: IDL.InterfaceFactory) {
    try {
      // TODO: allow passing identity?
      const agent = new HttpAgent({
        ...this.#config,
        identity: this.#identity,
      })

      if (this.#config.dev) {
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
      // TODO: why is this check here?
      if (identity) {
        this.#identity = identity
        this.#principal = principal
        return ok(true)
      }
      return ok(true)
    } catch (e) {
      console.error(e)
      return err({ kind: ConnectError.ConnectFailed })
    }
  }

  async disconnect() {
    try {
      await this.#client.logout()
      return ok(true)
    } catch (e) {
      console.error(e)
      return err({ kind: DisconnectError.DisconnectFailed })
    }
  }
}

export {
  NFID,
}