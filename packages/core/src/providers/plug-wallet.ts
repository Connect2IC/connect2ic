import type { IConnector, IWalletConnector } from "./connectors"
// @ts-ignore
import plugLogoLight from "../assets/plugLight.svg"
// @ts-ignore
import plugLogoDark from "../assets/plugDark.svg"
import { IDL } from "@dfinity/candid"
import { ActorSubclass, Agent } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"

type Plug = {
  createActor: <T>(args: { canisterId: string, interfaceFactory: IDL.InterfaceFactory }) => Promise<ActorSubclass<T>>
  agent: Agent
  createAgent: (options: { host: string, whitelist: Array<string> }) => Promise<Agent>
  getPrincipal: () => Promise<Principal>
  isConnected: () => Promise<boolean>
  disconnect: () => Promise<void>
  requestConnect: (Config) => Promise<boolean>
  requestTransfer: (args: {
    to: string,
    amount: number,
    opts?: {
      fee?: number,
      memo?: string,
      from_subaccount?: Number,
      created_at_time?: {
        timestamp_nanos: number
      },
    },
  }) => Promise<{
    height: Number
  }>
  requestBalance: () => Promise<Array<{
    amount: number
    canisterId: string
    decimals: number
    image?: string
    name: string
    symbol: string
  }>>
  getManagementCanister: () => Promise<ActorSubclass | undefined>
}

class PlugConnector implements IConnector, IWalletConnector {

  #config: {
    whitelist: Array<string>,
    host: string,
    dev: boolean,
  }
  #identity?: any
  #principal?: string
  #client?: any
  #ic?: Plug

  get identity() {
    return this.#identity
  }

  get principal() {
    return this.#principal
  }

  get client() {
    return this.#client
  }

  get ic() {
    return this.#ic
  }

  constructor(userConfig = {}) {
    this.#config = {
      whitelist: [],
      host: window.location.origin,
      dev: false,
      ...userConfig,
    }
    this.#ic = window.ic?.plug
  }

  async init() {
    if (!this.#ic) {
      throw Error("Not supported")
    }
    // TODO: returns true even if plug is locked
    // Fleek should fix
    const isConnected = await this.isConnected()
    if (isConnected) {
      try {
        await this.#ic.createAgent({
          host: this.#config.host,
          whitelist: this.#config.whitelist,
        })
        // TODO: never finishes if user doesnt login back / plug is locked?
        // Fleek should fix
        this.#principal = (await this.#ic.getPrincipal()).toString()
      } catch (e) {
        console.error(e)
      }
    }
    return true
  }

  async isConnected() {
    // TODO: no window
    return await this.#ic!.isConnected()
  }

  async createActor<Service>(canisterId: string, idlFactory: IDL.InterfaceFactory): Promise<ActorSubclass<Service> | undefined> {
    // Fetch root key for certificate validation during development
    if (this.#config.dev) {
      await this.#ic?.agent.fetchRootKey()
    }

    return this.#ic?.createActor({ canisterId, interfaceFactory: idlFactory })
  }

  // TODO: handle Plug account switching
  async connect() {
    if (!this.#ic) {
      window.open("https://plugwallet.ooo/", "_blank")
      throw Error("Not installed")
    }
    try {
      await this.#ic.requestConnect(this.#config)
      this.#principal = (await this.#ic.getPrincipal()).toString()
      return true
    } catch (e) {
      throw e
    }
  }

  async disconnect() {
    // TODO: should be awaited but never finishes, tell Plug to fix
    this.#ic?.disconnect()
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
                          to,
                          // TODO: fix return type
                        }: { amount: number, to: string }): Promise<boolean> {
    return !!this.#ic?.requestTransfer({
      to,
      amount: amount * 100000000,
    })
  }

  async queryBalance(): Promise<Array<{
    amount: number
    canisterId: string
    decimals: number
    image?: string
    name: string
    symbol: string
  }> | undefined> {
    return this.#ic?.requestBalance()
  }

  // signMessage({ message }) {
  //   return this.#ic?.signMessage({message})
  // }

  async getManagementCanister() {
    return this.#ic?.getManagementCanister()
  }

  // batchTransactions(...args) {
  //   return this.#ic?.batchTransactions(...args)
  // }
}

export const PlugWallet = {
  connector: PlugConnector,
  icon: {
    light: plugLogoLight,
    dark: plugLogoDark,
  },
  id: "plug",
  name: "Plug Wallet",
}