import type { IConnector, IWalletConnector } from "./connectors"
// @ts-ignore
import plugLogoLight from "../assets/plugLight.svg"
// @ts-ignore
import plugLogoDark from "../assets/plugDark.svg"
import { IDL } from "@dfinity/candid"
import { ActorSubclass, Agent } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"
import {
  ok,
  err,
} from "neverthrow"
import { BalanceError, ConnectError, CreateActorError, DisconnectError, InitError, TransferError } from "./connectors"

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
      from_subaccount?: number,
      created_at_time?: {
        timestamp_nanos: number
      },
    },
  }) => Promise<{
    height: number
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

class PlugWallet implements IConnector, IWalletConnector {

  public meta = {
    features: ["wallet"],
    icon: {
      light: plugLogoLight,
      dark: plugLogoDark,
    },
    id: "plug",
    name: "Plug Wallet",
  }

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
      dev: true,
      ...userConfig,
    }
    this.#ic = window.ic?.plug
  }

  set config(config) {
    this.#config = { ...this.#config, ...config }
  }

  get config() {
    return this.#config
  }

  async init() {
    // TODO: handle account switching
    try {
      if (!this.#ic) {
        // TODO: correct kind of error?
        return err({ kind: InitError.NotInstalled })
      }
      // TODO: returns true even if plug is locked
      // const isConnected = await Promise.race([this.isConnected(), new Promise((resolve) => setTimeout(() => resolve(false),1000))]) ?
      // Fleek should fix
      const isConnected = await this.isConnected()
      if (isConnected) {
        await this.#ic.createAgent({
          host: this.#config.host,
          whitelist: this.#config.whitelist,
        })
        // TODO: never finishes if user doesnt login back / plug is locked?
        // Fleek should fix
        this.#principal = (await this.#ic.getPrincipal()).toString()
      }
      return ok({ isConnected })
    } catch (e) {
      console.error(e)
      return err({ kind: InitError.InitFailed })
    }
  }

  async isConnected() {
    try {
      if (!this.#ic) {
        return false
      }
      return await this.#ic.isConnected()
    } catch (e) {
      console.error(e)
      return false
    }
  }

  async createActor<Service>(canisterId: string, idlFactory: IDL.InterfaceFactory) {
    if (!this.#ic) {
      return err({ kind: CreateActorError.NotInitialized })
    }
    try {
      // Fetch root key for certificate validation during development
      if (this.#config.dev) {
        const res = await this.#ic.agent.fetchRootKey().then(() => ok(true)).catch(e => err({ kind: CreateActorError.FetchRootKeyFailed }))
        if (res.isErr()) {
          return res
        }
      }
      const actor = await this.#ic.createActor<Service>({ canisterId, interfaceFactory: idlFactory })
      return ok(actor)
    } catch (e) {
      console.error(e)
      return err({ kind: CreateActorError.CreateActorFailed })
    }
  }

  // TODO: handle Plug account switching
  async connect() {
    try {
      if (!this.#ic) {
        window.open("https://plugwallet.ooo/", "_blank")
        // TODO: enum
        return err({ kind: ConnectError.NotInstalled })
      }
      await this.#ic.requestConnect(this.#config)
      this.#principal = (await this.#ic.getPrincipal()).toString()
      if (this.#principal) {
        // return status?
        return ok(true)
      }
      // return status?
      return ok(true)
    } catch (e) {
      console.error(e)
      return err({ kind: ConnectError.ConnectFailed })
    }
  }

  async disconnect() {
    try {
      // TODO: should be awaited but never finishes, tell Plug to fix
      // setTimeout?
      if (!this.#ic) {
        return err({ kind: DisconnectError.NotInitialized })
      }
      this.#ic.disconnect()
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


  async requestTransfer({
                          amount,
                          to,
                          // TODO: why is this needed??
                        }: { amount: number, to: string }) {
    try {
      const result = await this.#ic?.requestTransfer({
        to,
        amount: amount * 100000000,
      })

      switch (!!result) {
        case true:
          return ok({ height: result!.height })
        default:
          // TODO: ?
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
      const assets = await this.#ic.requestBalance()
      return ok(assets)
    } catch (e) {
      console.error(e)
      return err({ kind: BalanceError.QueryBalanceFailed })
    }
  }

  // TODO:

  // signMessage({ message }) {
  //   return this.#ic?.signMessage({message})
  // }

  // async getManagementCanister() {
  //   return this.#ic?.getManagementCanister()
  // }

  // batchTransactions(...args) {
  //   return this.#ic?.batchTransactions(...args)
  // }
}

export {
  PlugWallet,
}