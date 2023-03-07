import { AuthClient } from "@dfinity/auth-client"
import type { Identity } from "@dfinity/agent"
import type { IConnector } from "./connectors"
// @ts-ignore
import dfinityLogoLight from "../assets/dfinity.svg"
// @ts-ignore
import dfinityLogoDark from "../assets/dfinity.svg"
import {
  ok,
  err,
} from "neverthrow"
import { ConnectError, CreateActorError, DisconnectError, InitError, IWalletConnector, PROVIDER_STATUS } from "./connectors"
import { Methods } from "./connectors"
import {
  Actor,
  ActorSubclass,
  HttpAgent,
} from "@dfinity/agent"
import { _SERVICE as walletService } from "./ego/wallet_canister"
import { idlFactory as walletIdlFactory } from "./ego/wallet_canister.did"
import { ProxyActor } from "./ego/proxy"

class Ego implements IConnector {
  public meta = {
    features: [],
    icon: {
      light: dfinityLogoLight,
      dark: dfinityLogoDark,
    },
    id: "ego",
    name: "Ego",
    description: "Ego is a self-sovereign canister for the Internet Computer.",
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
    walletCanisterId: string
  }
  #identity?: Identity
  #principal?: string
  #client?: AuthClient
  #wallets: Array<IWalletConnector> = []
  #walletActor?: ActorSubclass<walletService>

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
      // TODO: ???
      walletCanisterId: "rrkah-fqaaa-aaaaa-aaaaq-cai",
      ...userConfig,
    }
  }

  set config(config) {
    this.#config = { ...this.#config, ...config }
  }

  get config() {
    return this.#config
  }

  // TODO: ?
  get identity() {
    return this.#identity
  }

  async init() {
    try {
      const isConnected = await this.isConnected()
      if (isConnected) {
        // TODO: ?
        // this.#identity = this.#client.getIdentity()
        this.#principal = this.#config.walletCanisterId
      }
      // TODO: pass identity?
      const agent = new HttpAgent({
        ...this.#config,
        identity: this.#identity,
      })

      if (this.#config.dev) {
        // Fetch root key for certificate validation during development
        // Fetch root key for certificate validation during development
        const res = await agent.fetchRootKey().then(() => ok(true)).catch(e => err({ kind: InitError.FetchRootKeyFailed }))
        if (res.isErr()) {
          return res
        }
      }
      this.#walletActor = Actor.createActor(walletIdlFactory, {
        agent,
        canisterId: this.#config.walletCanisterId,
      })
      return ok({ isConnected })
    } catch (e) {
      console.error(e)
      return err({ kind: InitError.InitFailed })
    }
  }

  async isConnected(): Promise<boolean> {
    try {
      // if (!this.#client) {
      //   return false
      // }
      // return await this.#client!.isAuthenticated()
      // TODO:
      return false
    } catch (e) {
      console.error(e)
      return false
    }
  }

  async status() {
    try {
      return PROVIDER_STATUS.IDLE
    } catch (e) {
      return PROVIDER_STATUS.IDLE
    }
  }

  async createActor<Service>(canisterId, idlFactory) {
    try {
      if (!this.#walletActor) {
        // TODO: different error?
        return err({ kind: CreateActorError.NotInitialized })
      }
      // TODO: add actorOptions?
      const actor = new ProxyActor(this.#walletActor, canisterId, idlFactory)
      return ok(actor as ActorSubclass<Service>)
    } catch (e) {
      console.error(e)
      return err({ kind: CreateActorError.CreateActorFailed })
    }
  }

  async connect() {
    try {
      // await new Promise<void>((resolve, reject) => {
      //   this.#client?.login({
      //     identityProvider: this.#config.providerUrl,
      //     onSuccess: resolve,
      //     onError: reject,
      //   })
      // })
      // TODO: ?
      // this.#identity = identity
      this.#principal = this.#config.walletCanisterId
      return ok(true)
    } catch (e) {
      console.error(e)
      return err({ kind: ConnectError.ConnectFailed })
    }
  }

  async disconnect() {
    try {
      // await this.#client?.logout()
      return ok(true)
    } catch (e) {
      console.error(e)
      return err({ kind: DisconnectError.DisconnectFailed })
    }
  }
}

export {
  Ego,
}