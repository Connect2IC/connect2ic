import { ActorSubclass } from "@dfinity/agent"
import type { Result } from "neverthrow"
import type { IDL } from "@dfinity/candid"

type CustomError<T> = { kind: T, message?: string }

export enum CreateActorError {
  FetchRootKeyFailed = "FETCH_ROOT_KEY_FAILED",
  CreateActorFailed = "CREATE_ACTOR_FAILED",
  NotInitialized = "NOT_INITIALIZED",
  LocalActorsNotSupported = "LOCAL_ACTORS_NOT_SUPPORTED",
}

export type CreateActorResult<Service> = Result<ActorSubclass<Service>, CustomError<CreateActorError>>

export enum ConnectError {
  NotInitialized = "NOT_INITIALIZED",
  NotInstalled = "NOT_INSTALLED",
  ConnectFailed = "CONNECT_FAILED",
  IsLocked = "IS_LOCKED",
}

export type ConnectResult = Result<boolean, CustomError<ConnectError>>

export enum DisconnectError {
  DisconnectFailed = "DISCONNECT_FAILED",
  NotInitialized = "NOT_INITIALIZED"
}

export type DisconnectResult = Result<boolean, CustomError<DisconnectError>>

export enum InitError {
  NotInstalled = "NOT_INSTALLED",
  InitFailed = "INIT_FAILED",
  FetchRootKeyFailed = "FETCH_ROOT_KEY_FAILED",

  Locked = "LOCKED",
}

export type InitResult = Result<{ isConnected: boolean }, CustomError<InitError>>

export enum Methods {
  BROWSER = "BROWSER",
  EXTENSION = "EXTENSION",
  APP = "APP",
  QR_CODE = "QR_CODE",
}

export enum PROVIDER_STATUS {
  LOCKED = "locked",
  CONNECTED = "connected",
  IDLE = "idle",
}

export interface IConnector {
  wallets: Array<IWalletConnector>
  init: () => Promise<InitResult>
  config: any
  meta: {
    icon: {
      light: string
      dark: string
    }
    methods: Array<Methods>
    description: string
    deepLinks?: { android: string, ios: string }
    id: string
    name: string
  }
  isConnected: () => Promise<boolean>
  status: () => Promise<PROVIDER_STATUS>
  createActor: <Service>(canisterId: string, interfaceFactory: IDL.InterfaceFactory, config?: {}) => Promise<CreateActorResult<Service>>
  connect: () => Promise<ConnectResult>
  disconnect: () => Promise<DisconnectResult>
  principal?: string
}

export enum BalanceError {
  NotInitialized = "NOT_INITIALIZED",
  QueryBalanceFailed = "QUERY_BALANCE_FAILED",
  QueryBalanceRejected = "QUERY_BALANCE_REJECTED",
}

export type BalanceResult = Result<Array<{
  amount: number
  canisterId: string
  decimals: number
  image?: string
  name: string
  symbol: string
}>, CustomError<BalanceError>>

export enum TokensError {
  NotInitialized = "NOT_INITIALIZED",
  QueryBalanceFailed = "QUERY_BALANCE_FAILED",
}

export type TokensResult = Result<Array<{
  amount: number
  canisterId: string
  decimals: number
  image?: string
  name: string
  symbol: string
}>, CustomError<TokensError>>

export enum NFTsError {
  NotInitialized = "NOT_INITIALIZED",
  QueryBalanceFailed = "QUERY_BALANCE_FAILED",
}

export type NFTsResult = Result<Array<{
  amount: number
  canisterId: string
  decimals: number
  image?: string
  name: string
  symbol: string
}>, CustomError<NFTsError>>

export enum TransferError {
  InsufficientBalance = "INSUFFICIENT_BALANCE",
  TransferFailed = "TRANSFER_FAILED",
  FaultyAddress = "FAULTY_ADDRESS",
  NotInitialized = "NOT_INITIALIZED",
  TokenNotSupported = "TOKEN_NOT_SUPPORTED",
  NotConnected = "NOT_CONNECTED",
  TransferRejected = "TRANSFER_REJECTED",
}

export type TransferResult = Result<{ height?: number; transactionId?: string; }, CustomError<TransferError>>
export type NFTTransferResult = Result<{ transactionId?: string; }, CustomError<TransferError>>

export enum SignError {
  NotConnected = "NOT_CONNECTED",
  NotInitialized = "NOT_INITIALIZED"
}

export type SignResult = Result<{ height: number }, CustomError<SignError>>

export interface IWalletConnector {
  requestTransfer: (args: {
    amount: number
    to: string
    symbol?: string
    standard?: string
  }) => Promise<TransferResult>
  requestTransferNFT?: (args: {
    to: string
    tokenIdentifier: string;
    tokenIndex: number;
    canisterId: string;
    standard: "ICP" | "DIP20" | "EXT" | "DRC20" | string;
  }) => Promise<NFTTransferResult>
  queryBalance: () => Promise<BalanceResult>
  // queryTokens: () => Promise<TokensResult>
  // queryNFTs: () => Promise<NFTsResult>
  // TODO:
  signMessage?: (any) => Promise<SignResult>
  // getManagementCanister: (any) => Promise<any>
  // callClientRPC: (any) => Promise<any>
  // requestBurnXTC: (any) => Promise<any>
  // batchTransactions: (any) => Promise<any>
}

// type ProviderOptions = {
//   connector: IConnector,
// }

