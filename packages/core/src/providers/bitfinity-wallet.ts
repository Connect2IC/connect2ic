import type { IConnector, IWalletConnector } from "./connectors"
import type { ActorSubclass, Agent } from "@dfinity/agent"
import type { IDL } from "@dfinity/candid"
// @ts-ignore
import bitfinityLogoLight from "../assets/bitfinity.png"
// @ts-ignore
import bitfinityLogoDark from "../assets/bitfinity.png"
import type { Principal } from "@dfinity/principal"
import { ConnectError, CreateActorError, DisconnectError, InitError, PROVIDER_STATUS } from "./connectors"
import { Methods } from "./connectors"

type Config = {
  whitelist: Array<string>,
  host: string,
}

type InjectedProvider = {
  createActor: <T>(args: {
    canisterId: string,
    interfaceFactory: IDL.InterfaceFactory,
    host: string
  }) => Promise<ActorSubclass<T>>
  agent: Agent
  getPrincipal: () => Promise<Principal>
  isConnected: () => Promise<boolean>
  disconnect: () => Promise<any>
  requestConnect: (Config) => Promise<boolean>
}

// class Wallet implements IWalletConnector {
//   #injectedProvider: InjectedProvider
//
//   constructor(injectedProvider: InjectedProvider) {
//     this.#injectedProvider = injectedProvider
//   }
//
//   // TODO: support tokens
//   async requestTransfer({
//                           amount,
//                           to,
//                           // TODO: why is type annotation needed??
//                         }: { amount: number, to: string }) {
//     try {
//       const result = await this.#injectedProvider.requestTransfer({
//         to,
//         amount: amount * 100000000,
//       })
//
//       switch (!!result) {
//         case true:
//           return ok({ height: result!.height })
//         default:
//           // TODO: ?
//           return err({ kind: TransferError.TransferFailed })
//       }
//     } catch (e) {
//       console.error(e)
//       return err({ kind: TransferError.TransferFailed })
//     }
//   }
//
//   // TODO:
//   async requestTransferNFT({
//                              amount,
//                              to,
//                              // TODO: why is type annotation needed??
//                            }: { amount: number, to: string }) {
//     // try {
//     //   const result = await this.#injectedProvider.requestTransfer({
//     //     to,
//     //     amount: amount * 100000000,
//     //   })
//     //
//     //   switch (!!result) {
//     //     case true:
//     //       return ok({ height: result!.height })
//     //     default:
//     //       // TODO: ?
//     //       return err({ kind: TransferError.TransferFailed })
//     //   }
//     // } catch (e) {
//     //   console.error(e)
//     //   return err({ kind: TransferError.TransferFailed })
//     // }
//   }
//
//   async queryBalance() {
//     try {
//       if (!this.#injectedProvider) {
//         return err({ kind: BalanceError.NotInitialized })
//       }
//       const assets = await this.#injectedProvider.requestBalance()
//       return ok(assets)
//     } catch (e) {
//       console.error(e)
//       return err({ kind: BalanceError.QueryBalanceFailed })
//     }
//   }
// }

class BitfinityWallet implements IConnector {

  public meta = {
    features: [],
    icon: {
      light: bitfinityLogoLight,
      dark: bitfinityLogoDark,
    },
    id: "bitfinity",
    name: "Bitfinity Wallet",
    description: "Your Crypto & NFT Wallet on the IC",
    deepLinks: {
      android: "intent://APP_HOST/#Intent;scheme=APP_NAME;package=APP_PACKAGE;end",
      ios: "astroxme://",
    },
    methods: [Methods.EXTENSION],
  }

  #config: Config
  #identity?: any
  #principal?: string
  #client?: any
  #ic?: InjectedProvider
  #wallets: Array<IWalletConnector> = []

  get wallets() {
    return this.#wallets
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

  get ic() {
    return this.#ic
  }

  constructor(userConfig = {}) {
    this.#config = {
      whitelist: [],
      host: window.location.origin,
      ...userConfig,
    }
    this.#ic = window.ic?.infinityWallet
  }

  set config(config) {
    this.#config = { ...this.#config, ...config }
  }

  get config() {
    return this.#config
  }

  // TODO: doesn't work if wallet is locked
  // test more & tell infinityswap
  async init() {
    if (!this.#ic) {
      throw new Error({ kind: InitError.NotInstalled })
    }
    try {
      const isConnected = await this.isConnected()
      if (isConnected) {
        // Otherwise agent doesn't become available. Infinity wallet should fix
        await this.connect()
        // this.#wallets = [new Wallet(this.#ic)]
        // TODO: never finishes if user doesnt login back?
        this.#principal = (await this.#ic.getPrincipal()).toString()
      }
      return { isConnected }
    } catch (e) {
      throw new Error({ kind: InitError.InitFailed, error: e })
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

  async status() {
    // TODO: locked?
    try {
      if (!this.#ic) {
        return PROVIDER_STATUS.IDLE
      }
      return await this.#ic.isConnected() ? PROVIDER_STATUS.CONNECTED : PROVIDER_STATUS.IDLE
    } catch (e) {
      console.error(e)
      // TODO: ???
      return PROVIDER_STATUS.IDLE
    }
  }

  async createActor<Service>(canisterId: string, idlFactory: IDL.InterfaceFactory, userConfig?: { host: string }) {
    const config = { host: this.#config.host, ...userConfig }
    if (!this.#ic) {
      throw new Error({ kind: CreateActorError.NotInitialized })
    }
    try {
      // if (this.#config.defaultNetwork === "local") {
      //   console.error("Infinity wallet doesn't support creating local actors")
      //   return err({
      //     kind: CreateActorError.LocalActorsNotSupported,
      //   })
      // }
      const actor = await this.#ic.createActor<Service>({
        canisterId,
        interfaceFactory: idlFactory,
        host: this.#config.host,
      })
      return actor
    } catch (e) {
      throw new Error({ kind: CreateActorError.CreateActorFailed, error: e })
    }
  }


  async connect() {
    if (!this.#ic) {
      // TODO: customizable behaviour?
      window.open("https://chrome.google.com/webstore/detail/infinity-wallet/jnldfbidonfeldmalbflbmlebbipcnle", "_blank")
      throw new Error({ kind: ConnectError.NotInstalled })
    }
    try {
      await this.#ic.requestConnect(this.#config)
      this.#principal = (await this.#ic.getPrincipal()).toString()
      return true
    } catch (e) {
      throw new Error({ kind: ConnectError.ConnectFailed, error: e })
    }
  }

  async disconnect() {
    if (!this.#ic) {
      throw new Error({ kind: DisconnectError.NotInitialized })
    }
    try {
      const ic = this.#ic
      await Promise.race([
        new Promise((resolve, reject) => {
          // InfinityWallet disconnect promise never resolves despite being disconnected
          // This is a hacky workaround
          setTimeout(async () => {
            const isConnected = await ic.isConnected()
            if (!isConnected) {
              resolve(isConnected)
            } else {
              // TODO: return err?
              reject()
            }
          }, 10)
        }),
        ic.disconnect(),
      ])
      return true
    } catch (e) {
      throw new Error({ kind: DisconnectError.DisconnectFailed, error: e })
    }
  }

  // async requestTransfer(...args) {
  //   // return this.#ic.requestTransfer(...args)
  // }

  // async queryBalance(...args) {
  //   return this.#ic.requestBalance(...args)
  // }

  // async signMessage(...args) {
  //   return this.#ic.signMessage(...args)
  // }

  //
  // getManagementCanister(...args) {
  //   return this.#ic.getManagementCanister(...args)
  // }

  // batchTransactions(...args) {
  //   return this.#ic.batchTransactions(...args)
  // }
}

export {
  BitfinityWallet,
}
