import { ActorSubclass } from "@dfinity/agent"
import type { Result } from "neverthrow"
import type { IDL } from "@dfinity/candid"

type CustomError<T> = { kind: T, message?: string }

export enum CreateActorError {
  FetchRootKeyFailed,
  CreateActorFailed,
  NotInitialized,
  LocalActorsNotSupported,
}

export enum ConnectError {
  NotInitialized,
  NotInstalled,
  ConnectFailed,
  IsLocked,
}

export enum DisconnectError {
  DisconnectFailed,
  NotInitialized
}

export enum InitError {
  NotInstalled,
  InitFailed
}

export enum TransferError {
  InsufficientBalance,
  TransferFailed,
  FaultyAddress,
  NotConnected
}

export type CreateActorResult<Service> = Result<ActorSubclass<Service>, CustomError<CreateActorError>>
export type ConnectResult = Result<boolean, CustomError<ConnectError>>
export type DisconnectResult = Result<boolean, CustomError<DisconnectError>>
export type InitResult = Result<{ isConnected: boolean }, CustomError<InitError>>

export interface IConnector {
  init: () => Promise<InitResult>
  config: any
  meta: {
    features: Array<string>
    icon: {
      light: string
      dark: string
    }
    id: string
    name: string
  }
  isConnected: () => Promise<boolean>
  createActor: <Service>(canisterId: string, interfaceFactory: IDL.InterfaceFactory) => Promise<CreateActorResult<Service>>
  connect: () => Promise<ConnectResult>
  disconnect: () => Promise<DisconnectResult>
  principal?: string
}

export enum BalanceError {
  NotInitialized,
  QueryBalanceFailed,
}

export type BalanceResult = Result<Array<{
  amount: number
  canisterId: string
  decimals: number
  image?: string
  name: string
  symbol: string
}>, CustomError<BalanceError>>

export type TransferResult = Result<{ height: number }, CustomError<TransferError>>

export interface IWalletConnector {
  address: () => {
    principal?: string
    accountId?: string
  },
  requestTransfer: ({
                      amount: number,
                      to: string,
                    }) => Promise<TransferResult>
  queryBalance: () => Promise<BalanceResult>
  // TODO:
  // signMessage?: (any) => Promise<any>
  // getManagementCanister: (any) => Promise<any>
  // callClientRPC: (any) => Promise<any>
  // requestBurnXTC: (any) => Promise<any>
  // batchTransactions: (any) => Promise<any>
}

// type ProviderOptions = {
//   connector: IConnector,
// }

