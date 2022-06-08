import { IC } from "@astrox/connection"
import type { IDL } from "@dfinity/candid"
import type { ActorSubclass, Identity } from "@dfinity/agent"
import {
  PermissionsType, SignerResponseSuccess,
  TransactionResponseFailure,
  TransactionResponseSuccess,
} from "@astrox/connection/lib/esm/types"
import type { IConnector, IWalletConnector } from "./connectors"
// @ts-ignore
import astroXLogoLight from "../assets/astrox_light.svg"
// @ts-ignore
import astroXLogoDark from "../assets/astrox.png"

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

class AstroXConnector implements IConnector, IWalletConnector {
  #config: {
    whitelist: Array<string>,
    providerUrl: string,
    ledgerCanisterId: string,
    ledgerHost?: string,
    host: string,
    dev: boolean,
  }
  #identity?: Identity
  #principal?: string
  #ic?: IC

  get identity(): Identity | undefined {
    return this.#ic?.identity
  }

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
      dev: false,
      ...userConfig,
    }
  }

  async init() {
    this.#ic = await IC.create({
      useFrame: !(window.innerWidth < 768),
      signerProviderUrl: `${this.#config.providerUrl}/signer`,
      walletProviderUrl: `${this.#config.providerUrl}/transaction`,
      identityProvider: `${this.#config.providerUrl}/login#authorize`,
      permissions: [PermissionsType.identity, PermissionsType.wallet],
      ledgerCanisterId: this.#config.ledgerCanisterId,
      ledgerHost: this.#config.ledgerHost,
      onAuthenticated: (icInstance: IC) => {
        this.#ic = (window.ic.astrox as IC) ?? icInstance
        this.#principal = this.#ic.principal.toText()
        this.#identity = this.#ic.identity
      },
      dev: this.#config.dev,
    })
    const isConnected = await this.isConnected()

    // TODO: figure out
    if (isConnected) {
      this.#identity = this.#ic.identity
      this.#principal = this.#ic.principal.toText()
    }
    return true
  }

  async isConnected(): Promise<boolean> {
    return this.#ic!.isAuthenticated()
  }

  async createActor<Service>(canisterId: string, idlFactory: IDL.InterfaceFactory): Promise<ActorSubclass<Service> | undefined> {
    // TODO: move from @astrox/connection here?
    // // Fetch root key for certificate validation during development
    return this.#ic?.createActor<Service>(idlFactory, canisterId)
  }

  async connect(): Promise<boolean> {
    await this.#ic?.connect({
      useFrame: !(window.innerWidth < 768),
      signerProviderUrl: `${this.#config.providerUrl}/signer`,
      walletProviderUrl: `${this.#config.providerUrl}/transaction`,
      identityProvider: `${this.#config.providerUrl}/login#authorize`,
      permissions: [PermissionsType.identity, PermissionsType.wallet],
      ledgerCanisterId: this.#config.ledgerCanisterId,
      ledgerHost: this.#config.ledgerHost,
      onAuthenticated: (icInstance: IC) => {
        this.#ic = window.ic.astrox ?? icInstance
        this.#principal = this.#ic!.principal.toText()
        this.#identity = this.#ic!.identity
        // this.#address = this.#ic.wallet
      },
    })
    // TODO: Result type
    return true
  }

  async disconnect(): Promise<boolean> {
    await this.#ic?.disconnect()
    return true
  }

  address() {
    return {
      principal: this.#principal,
      // accountId: this.#ic.accountId,
    }
  }

  async requestTransfer({
                          amount,
                          from,
                          to,
                          // TODO: fix return type
                        }: { amount: number, from: string, to: string }): Promise<string | TransactionResponseSuccess | undefined> {
    return this.#ic?.requestTransfer({
      amount: balanceFromString(String(amount)),
      from,
      to,
      // TODO: ?
      sendOpts: {},
    })
  }

  // TODO: gets called often
  async queryBalance(): Promise<Array<{
    amount: number
    canisterId: string
    decimals: number
    image: string
    name: string
    symbol: string
  }>> {
    const ICPBalance = Number(await this.#ic?.queryBalance()) ?? 0
    return [{
      amount: ICPBalance / 100000000,
      canisterId: this.#config.ledgerCanisterId,
      decimals: 8,
      // TODO: fix
      image: "Dfinity.svg",
      name: "ICP",
      symbol: "ICP",
    }]
  }

  async signMessage({ message }: { message: string }): Promise<SignerResponseSuccess | string | undefined> {
    return this.#ic?.signMessage({
      signerProvider: this.#config.providerUrl,
      message,
    })
  }

  // getManagementCanister: (...args) => this.#ic.getManagementCanister(...args),
  // batchTransactions: (...args) => this.#ic.batchTransactions(...args),
}

export const AstroX = {
  connector: AstroXConnector,
  icon: {
    light: astroXLogoLight,
    dark: astroXLogoDark,
  },
  id: "astrox",
  name: "AstroX ME",
}