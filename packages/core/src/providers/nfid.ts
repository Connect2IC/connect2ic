import { AuthClient } from "@dfinity/auth-client"
import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent"
import type { IConnector, IWalletConnector } from "./connectors"
// @ts-ignore
import nfidLogoLight from "../assets/nfid.png"
// @ts-ignore
import nfidLogoDark from "../assets/nfid.png"
import { IDL } from "@dfinity/candid"
import {
  ok,
  err, Result,
} from "neverthrow"
import {
  ConnectError,
  CreateActorError,
  DisconnectError,
  InitError,
  TransferError,
  BalanceError,
  PROVIDER_STATUS,
} from "./connectors"
import { Methods } from "./connectors"
import { requestTransfer, requestAccounts, RequestTransferParams } from "@nfid/wallet"

const APPLICATION_LOGO_URL = "https://nfid.one/icons/favicon-96x96.png"
const APP_META = `applicationName=RequestTransfer&applicationLogo=${APPLICATION_LOGO_URL}`
const NFID_ORIGIN = "https://nfid.one"
const REQ_TRANSFER = "wallet/request-transfer"

const PROVIDER_URL = new URL(`${NFID_ORIGIN}/${REQ_TRANSFER}?${APP_META}`)

class Wallet implements IWalletConnector {
  constructor() {
  }

  async requestTransfer(opts: { amount: number, to: string, standard?: string, symbol?: string, decimals?: number }) {
    const result = await requestTransfer(
      {
        to: opts.to,
        amount: opts.amount,
      },
      { provider: PROVIDER_URL },
    )
    if (result.status === "SUCCESS") {
      return ok({ height: result.height })
    }
    if (result.status === "REJECTED") {
      return err({ kind: TransferError.TransferRejected })
    }
    // if (result.status === 'ERROR') {
    return err({ kind: TransferError.TransferFailed })
    // }
  }

  async queryBalance() {
    const result = await requestAccounts({
      provider: PROVIDER_URL,
    })
    if (result.status === "SUCCESS") {
      // TODO: transform result
      // return ok(result.accounts.map((account) => ({
      //   balance: account.balance,
      // })))
      // TODO: !!!!!!!!
      return ok(result.accounts)
      // export type BalanceResult = Result<Array<{
      //   amount: number
      //   canisterId: string
      //   decimals: number
      //   image?: string
      //   name: string
      //   symbol: string
      // }>, CustomError<BalanceError>>
    }
    if (result.status === "REJECTED") {
      return err({ kind: BalanceError.QueryBalanceRejected })
    }
    // if (result.status === "ERROR") {
    return err({ kind: BalanceError.QueryBalanceFailed })
    // }
  }
}

class NFID implements IConnector {

  public meta = {
    features: [],
    icon: {
      light: nfidLogoLight,
      dark: nfidLogoDark,
    },
    id: "nfid",
    name: "NFID",
    description: "NFID is the digital identity for signing in to applications privately and securely",
    deepLinks: {
      android: "intent://APP_HOST/#Intent;scheme=APP_NAME;package=APP_PACKAGE;end",
      ios: "astroxme://",
    },
    methods: [Methods.BROWSER],
  }

  #config: {
    whitelist: Array<string>
    appName: string
    host: string
    providerUrl: string
    dev: boolean
  }
  #identity?: any
  #principal?: string
  #client?: any
  #wallets: Array<IWalletConnector> = []

  get wallets() {
    // TODO: @nfid/wallet
    return []
  }

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