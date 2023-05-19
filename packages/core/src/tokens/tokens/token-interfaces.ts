import { BurnParams, SendParams, SendResponse } from "./methods"
import { Principal } from "@dfinity/principal"
import { ActorSubclass } from "@dfinity/agent"
import XtcService, { BurnResult } from "./xtc/interfaces"
import { CapRoot, CapRouter } from "cap-js-without-npm-registry"

type SubAccount = [] | [Uint8Array];

export type Account = {
  owner: Principal;
  subaccount: SubAccount;
}

export interface BalanceResponse {
  value: bigint;
  decimals: number;
  error?: string;
}

export interface TokenMetadata {
  cycles?: number;
  deployTime?: number;
  historySize?: number;
  name: string;
  decimals: number;
  symbol: string;
  fee: number;
  feeTo: Account;
  holderNumber?: number;
  standard: string;
  totalSupply: number;
  owner: Account
}


export interface TokenWrapper {
  standard: string;

  actor: ActorSubclass<any>
  canisterId: string
  capRoot?: CapRoot
  capRouter?: CapRouter

  // new(args: {
  //   actor: ActorSubclass<any>,
  //   canisterId: string
  //   capRoot?: CapRoot
  //   capRouter?: CapRouter
  // }): TokenWrapper

  mint(receiver: Account, amount: number): Promise<any>

  send({ to, amount }: SendParams): Promise<SendResponse>

  getMetadata(): Promise<TokenMetadata>

  getBalance(user: Account): Promise<BalanceResponse>

  getDecimals(): Promise<number>

  // burnXTC(_actor: ActorSubclass<Dip20Service>, _params: BurnParams)
  burnXTC?(actor: ActorSubclass<XtcService>, { to, amount }: BurnParams): Promise<BurnResult>

  getHistory?(): Promise<{
    caller: string;
    // operation: tx.operation,
    time: number;
    // // TODO: account-id?
    from: string;
    to: string;
    amount: string;
    fee: string;
    status: string;
  }>

  getHolders?(start: number, end: number): Promise<Array<{
    address: string;
    balance: number;
  }>>
}

