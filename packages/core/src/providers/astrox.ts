import { IC } from "@astrox/sdk-web"
import type { IDL } from "@dfinity/candid"
import type { ActorSubclass, Identity } from "@dfinity/agent"
import { PermissionsType } from "@astrox/connection/lib/esm/types"
import type { IConnector, IWalletConnector } from "./connectors"
import {
  BalanceError,
  ConnectError,
  CreateActorError,
  DisconnectError,
  InitError,
  Methods,
  PROVIDER_STATUS,
  TransferError,
} from "./connectors"
// @ts-ignore
import astroXLogoLight from "../assets/astrox_light.svg"
// @ts-ignore
import astroXLogoDark from "../assets/astrox.png"
import { TransactionMessageKind } from "@astrox/sdk-web/build/types"

const balanceFromString = (balance: string, decimal = 8): bigint => {
  const list = balance.split(".")
  const aboveZero = list[0]
  const aboveZeroBigInt = BigInt(aboveZero) * BigInt(1 * 10 ** decimal)
  let belowZeroBigInt = BigInt(0)
  const belowZero = list[1]
  if (belowZero !== undefined) {
    belowZeroBigInt = BigInt(
      belowZero.substring(0, decimal).padEnd(decimal, "0"),
    )
  }
  return aboveZeroBigInt + belowZeroBigInt
}

type Config = {
  whitelist: Array<string>,
  providerUrl: string,
  ledgerCanisterId: string,
  ledgerHost?: string,
  noUnify?: boolean,
  host: string,
  dev: boolean,
}

class Wallet implements IWalletConnector {

  #ic: IC
  #config: Config

  constructor(userConfig: Config, ic: IC) {
    this.#config = userConfig
    this.#ic = ic
  }

  async requestTransfer(opts: { amount: number, to: string, standard?: string, symbol?: string, decimals?: number }) {
    const { to, amount, standard = "ICP", symbol = "ICP", decimals = 8 } = opts
    let result
    try {
      result = await this.#ic?.requestTransfer({
        amount: BigInt(amount * (10 ** decimals)),
        to,
        standard,
        symbol,
        // TODO: ?
        sendOpts: {},
      })
    } catch (e) {
      console.error(e)
      throw new Error({ kind: TransferError.TransferFailed, error: e })
    }
    // TODO: why string? check astrox-js
    if (typeof result === "string") {
      throw new Error({ kind: TransferError.FaultyAddress })
    }
    // check astrox-js
    if (!result) {
      throw new Error({ kind: TransferError.TransferFailed })
    }
    switch (result?.kind) {
      case "transaction-client-success":
        return {
          // TODO: why is payload optional? check astrox-js
          height: Number(result.payload?.blockHeight),
        }
      default:
        throw new Error({ kind: TransferError.TransferFailed })
    }
  }

  async requestTransferNFT(args: {
    tokenIdentifier: string;
    tokenIndex: number;
    canisterId: string;
    to: string;
    standard: string;
  }) {
    const {
      tokenIdentifier,
      tokenIndex,
      canisterId,
      standard,
      to,
    } = args
    if (!this.#ic) {
      throw new Error({ kind: TransferError.NotInitialized })
    }
    let response
    try {
      response = await this.#ic.requestTransfer({
        tokenIdentifier,
        tokenIndex,
        canisterId,
        standard,
        to,
        sendOpts: {},
        symbol: "",
      })
    } catch (e) {
      throw new Error({ kind: TransferError.TransferFailed, error: e })
    }
    if (!response || typeof response === "string" /* || response.kind === TransactionMessageKind.fail*/) {
      throw new Error({ kind: TransferError.TransferFailed })
    }
    if (response.kind === TransactionMessageKind.success) {
      return {
        // ...response.payload,
        // TODO: fixxxxxxxx
        transactionId: String(response.payload?.blockHeight),
        // height: Number(response.payload?.blockHeight),
      }
    }

    throw new Error({ kind: TransferError.TransferFailed })
  }

  async queryBalance() {
    let ICPBalance
    try {
      ICPBalance = Number(await this.#ic?.queryBalance()) ?? 0
    } catch (e) {
      throw new Error({ kind: BalanceError.QueryBalanceFailed, error: e })
    }
    return [{
      amount: ICPBalance / 100000000,
      canisterId: this.#config.ledgerCanisterId,
      decimals: 8,
      // TODO: plug returns image?
      // image: "Dfinity.svg",
      name: "ICP",
      symbol: "ICP",
    }]
  }

}

class AstroX implements IConnector {

  public meta = {
    features: ["wallet"],
    icon: {
      light: astroXLogoLight,
      dark: astroXLogoDark,
    },
    id: "astrox",
    name: "AstroX ME",
    description: "Your Self-Custody Passport to Web3 Apps.",
    deepLinks: {
      android: "intent://APP_HOST/#Intent;scheme=APP_NAME;package=APP_PACKAGE;end",
      ios: "astroxme://",
    },
    methods: [Methods.BROWSER, Methods.APP],
  }

  #config: Config
  #identity?: Identity
  #principal?: string
  #ic?: IC
  #wallets: Array<IWalletConnector> = []

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
  }

  set config(config) {
    this.#config = { ...this.#config, ...config }
  }

  get config() {
    return this.#config
  }

  async init() {
    try {
      const ic = await IC.create({
        useFrame: !(window.innerWidth < 768),
        signerProviderUrl: `${this.#config.providerUrl}/#signer`,
        walletProviderUrl: `${this.#config.providerUrl}/#transaction`,
        identityProvider: `${this.#config.providerUrl}/#authorize`,
        permissions: [PermissionsType.identity, PermissionsType.wallet],
        host: this.#config.host,
        ledgerCanisterId: this.#config.ledgerCanisterId,
        ledgerHost: this.#config.ledgerHost,
        dev: this.#config.dev,
        delegationTargets: this.#config.whitelist,
        noUnify: this.#config.noUnify,
      })
      this.#ic = (window.ic.astrox as IC) ?? ic
      this.#principal = this.#ic.principal.toText()
      // TODO: export Identity from @astrox/connection
      // @ts-ignore
      this.#identity = this.#ic.identity
      const isConnected = await this.isConnected()
      if (isConnected) {
        // @ts-ignore
        this.#identity = this.#ic.identity
        this.#principal = this.#ic.principal.toText()
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
      return await this.#ic.isAuthenticated()
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
      return await this.#ic.isAuthenticated() ? PROVIDER_STATUS.CONNECTED : PROVIDER_STATUS.IDLE
    } catch (e) {
      console.error(e)
      return PROVIDER_STATUS.IDLE
    }
  }

  // TODO: export & use types from astrox/connection instead of dfinity/agent
  async createActor<Service>(canisterId: string, idlFactory: IDL.InterfaceFactory): Promise<ActorSubclass<Service>> {
    try {
      if (!this.#ic) {
        throw new Error({ kind: CreateActorError.NotInitialized })
      }
      const actor = await this.#ic.createActor<Service>(idlFactory, canisterId)
      return actor
    } catch (e) {
      throw new Error({ kind: CreateActorError.CreateActorFailed, error: e })
    }
  }

  async connect() {
    if (!this.#ic) {
      throw new Error({ kind: ConnectError.NotInitialized })
    }
    try {
      await this.#ic.connect({
        useFrame: !(window.innerWidth < 768),
        signerProviderUrl: `${this.#config.providerUrl}/#signer`,
        walletProviderUrl: `${this.#config.providerUrl}/#transaction`,
        identityProvider: `${this.#config.providerUrl}/#authorize`,
        permissions: [PermissionsType.identity, PermissionsType.wallet],
        host: this.#config.host,
        ledgerCanisterId: this.#config.ledgerCanisterId,
        ledgerHost: this.#config.ledgerHost,
        delegationTargets: this.#config.whitelist,
        noUnify: this.#config.noUnify,
      })
      this.#principal = this.#ic.principal.toText()
      // @ts-ignore
      this.#identity = this.#ic.identity
      // TODO: move out or not? how to pass this.#ic if yes
      this.#wallets = [new Wallet(this.#config, this.#ic)]
      return true
    } catch (e) {
      throw new Error({ kind: ConnectError.ConnectFailed, error: e })
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

  // async signMessage({ message }: { message: string }): Promise<SignerResponseSuccess | string | undefined> {
  //   return this.#ic?.signMessage({
  //     signerProvider: this.#config.providerUrl,
  //     message,
  //   })
  // }

  // getManagementCanister: (...args) => this.#ic.getManagementCanister(...args),

  // TODO: ?
  // batchTransactions: (...args) => this.#ic.batchTransactions(...args),


  // async requestTransfer(opts: { amount: number, to: string, standard?: string, symbol?: string, decimals?: number }) {
  //   const { to, amount, standard = "ICP", symbol = "ICP", decimals = 8 } = opts
  //   try {
  //     const result = await this.#ic?.requestTransfer({
  //       amount: BigInt(amount * (10 ** decimals)),
  //       to,
  //       standard,
  //       symbol,
  //       // TODO: ?
  //       sendOpts: {},
  //     })
  //     // TODO: why string? check astrox-js
  //     if (typeof result === "string") {
  //       return err({ kind: TransferError.FaultyAddress })
  //     }
  //     // check astrox-js
  //     if (!result) {
  //       return err({ kind: TransferError.TransferFailed })
  //     }
  //     switch (result?.kind) {
  //       case "transaction-client-success":
  //         return ok({
  //           // TODO: why is payload optional? check astrox-js
  //           height: Number(result.payload?.blockHeight),
  //         })
  //       default:
  //         return err({ kind: TransferError.TransferFailed })
  //     }
  //   } catch (e) {
  //     console.error(e)
  //     return err({ kind: TransferError.TransferFailed })
  //   }
  // }
  //
  // async requestTransferNFT(args: {
  //   tokenIdentifier: string;
  //   tokenIndex: number;
  //   canisterId: string;
  //   to: string;
  //   standard: string;
  // }) {
  //   try {
  //     const {
  //       tokenIdentifier,
  //       tokenIndex,
  //       canisterId,
  //       standard,
  //       to,
  //     } = args
  //     if (!this.#ic) {
  //       return err({ kind: TransferError.NotInitialized })
  //     }
  //     const response = await this.#ic.requestTransfer({
  //       tokenIdentifier,
  //       tokenIndex,
  //       canisterId,
  //       standard,
  //       to,
  //       sendOpts: {},
  //       symbol: "",
  //     })
  //     if (!response || typeof response === "string" || response.kind === TransactionMessageKind.fail) {
  //       return err({ kind: TransferError.TransferFailed })
  //     }
  //     if (response.kind === TransactionMessageKind.success) {
  //       return ok({
  //         // TODO: fix
  //         ...response.payload,
  //         // height: Number(response.payload.blockHeight),
  //       })
  //     }
  //     return err({ kind: TransferError.TransferFailed })
  //   } catch (e) {
  //     console.error(e)
  //     return err({ kind: TransferError.TransferFailed })
  //   }
  // }
  //
  // async queryBalance() {
  //   try {
  //     const ICPBalance = Number(await this.#ic?.queryBalance()) ?? 0
  //     return ok([{
  //       amount: ICPBalance / 100000000,
  //       canisterId: this.#config.ledgerCanisterId,
  //       decimals: 8,
  //       // TODO: plug returns image?
  //       // image: "Dfinity.svg",
  //       name: "ICP",
  //       symbol: "ICP",
  //     }])
  //   } catch (e) {
  //     console.error(e)
  //     return err({ kind: BalanceError.QueryBalanceFailed })
  //   }
  // }
}

export {
  AstroX,
}
