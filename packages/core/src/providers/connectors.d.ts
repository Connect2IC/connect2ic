import { ActorSubclass } from "@dfinity/agent"
import { Result } from "fp-ts"

export interface IConnector {
  init: () => Promise<boolean>
  config: any
  isConnected: () => Promise<boolean>
  // TODO: Result type
  createActor: <Service>(canisterId: string, interfaceFactory: IDL.InterfaceFactory) => Promise<ActorSubclass<Service> | undefined>
  // TODO: Result type
  connect: () => Promise<boolean>
  // TODO: Result type
  disconnect: () => Promise<boolean>
  principal: string | undefined
}

export interface IWalletConnector {
  // TODO: Result type?
  address: () => {
    principal?: string
    accountId?: string
  },
  requestTransfer: ({ amount: number, to: string }) => Promise<any>
  queryBalance: () => Promise<Array<{
    amount: number
    canisterId: string
    decimals: number
    image?: string
    name: string
    symbol: string
  }> | undefined>
  signMessage?: (any) => Promise<any>
  // getManagementCanister: (any) => Promise<any>
  // callClientRPC: (any) => Promise<any>
  // requestBurnXTC: (any) => Promise<any>
  // batchTransactions: (any) => Promise<any>
}

// type ProviderOptions = {
//   connector: IConnector,
// }

