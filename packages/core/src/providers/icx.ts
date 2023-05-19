import type { IDL } from "@dfinity/candid"
import type { ActorSubclass, Identity } from "@dfinity/agent"
import type { IConnector, IWalletConnector } from "./connectors"
import { AstroXWebViewHandler } from "@astrox/sdk-webview"
// @ts-ignore
import astroXLogoLight from "../assets/astrox_light.svg"
// @ts-ignore
import astroXLogoDark from "../assets/astrox.png"
import {
  SignError,
  BalanceError,
  ConnectError,
  CreateActorError,
  DisconnectError,
  InitError,
  TransferError,
  TokensError,
  NFTsError, PROVIDER_STATUS,
} from "./connectors"
import {
  SupportedToken,
  TransactionMessageKind,
  TransactionResponseSuccess,
  TransactionType,
} from "@astrox/sdk-webview/build/types"
import { Methods } from "./connectors"
import { Account } from "../nfts/nft-interfaces"
import { Principal } from "@dfinity/principal"

function fromHexString(hexString: string): Uint8Array {
  return new Uint8Array((hexString.match(/.{1,2}/g) ?? []).map(byte => parseInt(byte, 16)))
}

class Wallet implements IWalletConnector {
  #supportedTokenList: Array<{
    symbol: string;
    standard: string;
    decimals: number;
    fee: string;
    name: string;
    canisterId: string;
  }> = []
  #ic: AstroXWebViewHandler
  #connector: ICX
  #account: Account

  constructor(connector: ICX, ic: AstroXWebViewHandler, supportedTokenList) {
    this.#supportedTokenList = supportedTokenList
    this.#connector = connector
    this.#ic = ic
    const { principal, accountId } = this.#ic.wallet
    // TODO: convert accountId: string to Uint8Array
    this.#account = { owner: Principal.from(principal), subaccount: [fromHexString(accountId)] }
  }

  async requestTransferNFT(args: {
    tokenIdentifier: string;
    tokenIndex: number;
    canisterId: string;
    to: string;
    standard: string;
  }) {
    if (!this.#ic) {
      throw new Error({ kind: TransferError.NotInitialized })
    }
    let response
    try {
      const {
        tokenIdentifier,
        tokenIndex,
        canisterId,
        standard,
        to,
      } = args
      response = await this.#ic.requestTransfer({
        tokenIdentifier,
        tokenIndex,
        canisterId,
        standard,
        to,
      })
    } catch (e) {
      throw new Error({ kind: TransferError.TransferFailed, error: e })
    }
    if (response.kind === TransactionMessageKind.fail) {
      throw new Error({ kind: TransferError.TransferFailed })
    }
    if (response.kind === TransactionMessageKind.success) {
      return {
        // TODO: transactionId?
        // transactionId: response.kind
        // ...response.payload,
      }
    }
    throw new Error({ kind: TransferError.TransferFailed })
  }

  async requestTransfer(args) {
    const {
      amount,
      to,
      symbol = "ICP",
      standard = "ICP",
    } = args
    // TODO: some better way to do this?
    const tokenInfo = this.#supportedTokenList.find(({
                                                       symbol: tokenSymbol,
                                                     }) => symbol === tokenSymbol)
    if (!tokenInfo) {
      throw new Error({ kind: TransferError.TokenNotSupported })
    }
    let response
    try {
      response = await this.#ic?.requestTransfer({
        amount: BigInt(amount * (10 ** tokenInfo.decimals)),
        to,
        symbol,
        standard,
      })
    } catch (e) {
      throw new Error({ kind: TransferError.TransferFailed, error: e })
    }
    if (!response || response.kind === TransactionMessageKind.fail) {
      // message?
      throw new Error({ kind: TransferError.TransferFailed })
    }

    if (response.kind === TransactionMessageKind.success) {
      return {
        // TODO: transactionId ??? see astrox-js-sdk
        ...response.payload,
        // height: (response as TransactionResponseSuccess).payload ?? Number(response.payload.blockHeight),
      }
    }
    throw new Error({ kind: TransferError.TransferFailed })
  }

  async queryBalance() {
    if (!this.#ic) {
      throw new Error({ kind: BalanceError.NotInitialized })
    }
    try {
      const response = await this.#ic.queryBalance()
      response.forEach(token => token.amount = token.amount / (10 ** token.decimals))
      return response
    } catch (e) {
      throw new Error({ kind: BalanceError.QueryBalanceFailed, error: e })
    }
  }

  // async queryTokens() {
  //   try {
  //     if (!this.#ic) {
  //       return err({ kind: TokensError.NotInitialized })
  //     }
  //     const response = await this.#ic.queryBalance()
  //     return ok(response)
  //   } catch (e) {
  //     console.error(e)
  //     return err({ kind: TokensError.QueryBalanceFailed })
  //   }
  // }

  // async queryNFTs() {
  //   try {
  //     if (!this.#ic) {
  //       return err({ kind: NFTsError.NotInitialized })
  //     }
  //     // const response = await this.#ic.queryBalance()
  //     return ok(response)
  //   } catch (e) {
  //     console.error(e)
  //     return err({ kind: NFTsError.QueryBalanceFailed })
  //   }
  // }
}

class ICX implements IConnector {

  public meta = {
    features: ["wallet"],
    icon: {
      light: astroXLogoLight,
      dark: astroXLogoDark,
    },
    id: "icx",
    name: "ICX",
    methods: [Methods.APP],
    description: "",
  }

  #config: {
    whitelist: Array<string>
    providerUrl: string
    ledgerCanisterId: string
    ledgerHost?: string
    host: string
    dev: boolean
    noUnify?: boolean
  }
  #ic: AstroXWebViewHandler
  #principal?: string
  #wallets: Array<IWalletConnector> = []
  #supportedTokenList: Array<SupportedToken>

  get principal() {
    return this.#principal
  }

  get wallets() {
    return this.#wallets
  }

  constructor(userConfig = {}) {
    this.#config = {
      whitelist: [],
      providerUrl: "https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app",
      ledgerCanisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
      ledgerHost: "https://boundary.ic0.app/",
      host: window.location.origin,
      dev: true,
      noUnify: false,
      ...userConfig,
    }
    this.#ic = new AstroXWebViewHandler()
    this.#supportedTokenList = []
  }

  set config(config) {
    this.#config = { ...this.#config, ...config }
  }

  get config() {
    return this.#config
  }

  async init() {
    try {
      await this.#ic.init()
      this.#supportedTokenList = await this.#ic.getSupportedTokenList()
      const isConnected = await this.isConnected()
      // TODO: never connected
      if (isConnected) {
        this.#principal = this.#ic.getPrincipal().toText()
        this.#wallets = [new Wallet(this, this.#ic, this.#supportedTokenList)]
        if (this.#config.dev) {
          await this.#ic.agent.fetchRootKey()
        }
      }
      return { isConnected }
    } catch (e) {
      throw new Error({ kind: InitError.InitFailed, error: e })
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

  async status() {
    try {
      if (!this.#ic) {
        return PROVIDER_STATUS.IDLE
      }
      return await this.#ic.isConnected() ? PROVIDER_STATUS.CONNECTED : PROVIDER_STATUS.IDLE
    } catch (e) {
      console.error(e)
      return PROVIDER_STATUS.IDLE
    }
  }

  // TODO: export & use types from astrox/connection instead of dfinity/agent
  async createActor<Service>(canisterId: string, idlFactory: IDL.InterfaceFactory, config = {}): Promise<ActorSubclass<Service>> {
    if (!this.#ic) {
      throw new Error({ kind: CreateActorError.NotInitialized })
    }
    try {
      const actor = await this.#ic.createActor<Service>(canisterId, idlFactory)
      if (!actor) {
        throw new Error({ kind: CreateActorError.CreateActorFailed })
      }
      return actor
    } catch (e) {
      throw new Error({ kind: CreateActorError.CreateActorFailed })
    }
  }

  async connect() {
    if (!this.#ic) {
      throw new Error({ kind: ConnectError.NotInitialized })
    }
    try {
      await this.#ic.connect({
        delegationTargets: this.#config.whitelist,
        host: this.#config.host,
        noUnify: this.#config.noUnify,
      })
      this.#principal = this.#ic.getPrincipal().toText()
      if (this.#config.dev) {
        // TODO: fetch root key failed error?
        await this.#ic.agent.fetchRootKey()
      }
      return true
    } catch (e) {
      throw new Error({ kind: ConnectError.ConnectFailed })
    }
  }

  async disconnect() {
    try {
      await this.#ic?.disconnect()
      return true
    } catch (e) {
      throw new Error({ kind: DisconnectError.DisconnectFailed, error: e })
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
