import type { IDL } from "@dfinity/candid"
import type { ActorSubclass, Identity } from "@dfinity/agent"
import type { IConnector, IWalletConnector } from "../connectors"
import type { TransferNFTWithIdentifier, TransferToken, BaseTransactionRequest, Wallet } from "@astrox/sdk-core"
import type { AstroXWebViewHandler } from "@astrox/sdk-webview"
// @ts-ignore
import astroXLogoLight from "../../assets/astrox_light.svg"
// @ts-ignore
import astroXLogoDark from "../../assets/astrox.png"
import {
  ok,
  err, Result,
} from "neverthrow"
import {
  SignError,
  BalanceError,
  ConnectError,
  CreateActorError,
  DisconnectError,
  InitError,
  TransferError,
} from "../connectors"

class ICX implements IConnector, IWalletConnector {

  // TODO:
  // private readonly _isReady: boolean = false
  // private readonly env: any
  //

  public meta = {
    features: ["wallet"],
    icon: {
      light: astroXLogoLight,
      dark: astroXLogoDark,
    },
    id: "astrox",
    name: "AstroX ME",
  }

  #config: {
    whitelist: Array<string>
    providerUrl: string
    ledgerCanisterId: string
    ledgerHost?: string
    host: string
    dev: boolean
  }
  #ic: AstroXWebViewHandler
  #principal?: string

  get principal() {
    return this.#principal
  }

  constructor(userConfig = {}) {
    this.#config = {
      whitelist: [],
      providerUrl: "https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app",
      ledgerCanisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
      ledgerHost: "https://boundary.ic0.app/",
      host: window.location.origin,
      dev: true,
      ...userConfig,
    }
    // @ts-ignore
    this.#ic = window.icx as AstroXWebViewHandler
  }

  set config(config) {
    this.#config = { ...this.#config, ...config }
  }

  get config() {
    return this.#config
  }

  async init() {
    try {
      const isConnected = await this.isConnected()
      // TODO: never connected
      if (isConnected) {
        this.#principal = this.#ic.getPrincipal().toText()
      }
      return ok({ isConnected })
    } catch (e) {
      console.error(e)
      return err({ kind: InitError.InitFailed })
    }
  }

  async isConnected(): Promise<boolean> {
    try {
      if (!this.#ic) {
        return false
      }
      const isConnected = await this.#ic.isConnected()
      // TODO: fix at astrox-js-sdk
      return !!isConnected
    } catch (e) {
      console.error(e)
      return false
    }
  }

  // TODO: export & use types from astrox/connection instead of dfinity/agent
  async createActor<Service>(canisterId: string, idlFactory: IDL.InterfaceFactory, config = {}): Promise<Result<ActorSubclass<Service>, { kind: CreateActorError; }>> {
    try {
      // TODO: support per actor configuration
      if (this.#config.dev) {
        return err({ kind: CreateActorError.LocalActorsNotSupported })
      }
      if (!this.#ic) {
        return err({ kind: CreateActorError.NotInitialized })
      }
      // @ts-ignore
      const actor = await this.#ic.createActor<Service>(canisterId, idlFactory)
      if (!actor) {
        return err({ kind: CreateActorError.CreateActorFailed })
      }
      // @ts-ignore
      return ok(actor)
    } catch (e) {
      console.error(e)
      return err({ kind: CreateActorError.CreateActorFailed })
    }
  }

  async connect() {
    try {
      if (!this.#ic) {
        return err({ kind: ConnectError.NotInitialized })
      }
      await this.#ic.connect({
        delegationTargets: this.#config.whitelist,
        host: this.#config.host,
      })
      this.#principal = this.#ic.getPrincipal().toText()
      return ok(true)
    } catch (e) {
      console.error(e)
      return err({ kind: ConnectError.ConnectFailed })
    }
  }

  // TODO:
  // public async disconnect(): Promise<boolean> {
  //   this._cacheKey && (await _ms.disconnect.invoke(this._cacheKey))
  //   this.removePrivateKey()
  //
  //
  //   return true
  // }
  async disconnect() {
    try {
      await this.#ic?.disconnect()
      return ok(true)
    } catch (e) {
      console.error(e)
      return err({ kind: DisconnectError.DisconnectFailed })
    }
  }

  address() {
    return {
      principal: this.#principal,
      // accountId: this.#ic.accountId,
    }
  }

  async requestTransferNFT(args: TransferNFTWithIdentifier): Promise<Result<string, { kind: TransferError; }>> {
    try {
      const {
        tokenIdentifier,
        tokenIndex,
        canisterId,
        standard,
        to,
        // symbol,
        amount = 1,
      } = args
      if (!this.#ic) {
        return err({ kind: TransferError.NotInitialized })
      }
      const result = await this.#ic.requestTransfer({
        tokenIdentifier,
        tokenIndex,
        canisterId,
        standard,
        to,
      })
      if (!result) {
        return err({ kind: TransferError.TransferFailed })
      }
      return ok(result)
    } catch (e) {
      console.error(e)
      return err({ kind: TransferError.TransferFailed })
    }
  }

  async requestTransfer(args) {
    const {
      amount,
      to,
      symbol = "ICP",
      standard = "ICP",
    } = args
    try {
      const result = await this.#ic?.requestTransfer({
        amount,
        to,
        symbol,
        standard,
      })
      // TODO: why string? check astrox-js
      if (typeof result === "string") {
        return err({ kind: TransferError.FaultyAddress })
      }
      // check astrox-js
      if (!result) {
        return err({ kind: TransferError.TransferFailed })
      }
      switch (result?.kind) {
        case "transaction-client-success":
          return ok({
            // TODO: why is payload optional? check astrox-js
            height: Number(result.payload?.blockHeight),
          })
        default:
          return err({ kind: TransferError.TransferFailed })
      }
    } catch (e) {
      console.error(e)
      return err({ kind: TransferError.TransferFailed })
    }
  }

  async queryBalance() {
    try {
      if (!this.#ic) {
        return err({ kind: BalanceError.NotInitialized })
      }
      const response = await this.#ic.queryBalance()
      return ok(response)
    } catch (e) {
      console.error(e)
      return err({ kind: BalanceError.QueryBalanceFailed })
    }
  }

  // TODO:
  // public async signMessage(message: string): Promise<any> => this.#ic.signMessage(message)
  // getManagementCanister: (...args) => this.#ic.getManagementCanister(...args),
  // batchTransactions: (...args) => this.#ic.batchTransactions(...args),
}

export {
  ICX,
}