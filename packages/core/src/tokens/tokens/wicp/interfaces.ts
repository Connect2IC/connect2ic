import type { Principal } from "@dfinity/principal"

export interface Metadata {
  fee: bigint;
  decimals: number;
  owner: Principal;
  logo: string;
  name: string;
  totalSupply: bigint;
  symbol: string;
}

export interface TokenInfo {
  holderNumber: bigint;
  deployTime: bigint;
  metadata: Metadata;
  historySize: bigint;
  cycles: bigint;
  feeTo: Principal;
}

export type TxError =
  | { InsufficientAllowance: null }
  | { InsufficientBalance: null }
  | { ErrorOperationStyle: null }
  | { Unauthorized: null }
  | { LedgerTrap: null }
  | { ErrorTo: null }
  | { Other: null }
  | { BlockUsed: null }
  | { AmountTooSmall: null };
export type TxReceipt = { Ok: bigint } | { Err: TxError };
export default interface _SERVICE {
  allowance: (arg_0: Principal, arg_1: Principal) => Promise<bigint>;
  approve: (arg_0: Principal, arg_1: bigint) => Promise<TxReceipt>;
  balanceOf: (arg_0: Principal) => Promise<bigint>;
  decimals: () => Promise<number>;
  getAllowanceSize: () => Promise<bigint>;
  getHolders: (arg_0: bigint, arg_1: bigint) => Promise<Array<[Principal, bigint]>>;
  getLogo: () => Promise<string>;
  getMetadata: () => Promise<Metadata>;
  getTokenInfo: () => Promise<TokenInfo>;
  getUserApprovals: (arg_0: Principal) => Promise<Array<[Principal, bigint]>>;
  historySize: () => Promise<bigint>;
  mint: (arg_0: [] | [Array<number>], arg_1: bigint) => Promise<TxReceipt>;
  name: () => Promise<string>;
  owner: () => Promise<Principal>;
  setFee: (arg_0: bigint) => Promise<undefined>;
  setFeeTo: (arg_0: Principal) => Promise<undefined>;
  setLogo: (arg_0: string) => Promise<undefined>;
  setName: (arg_0: string) => Promise<undefined>;
  setOwner: (arg_0: Principal) => Promise<undefined>;
  symbol: () => Promise<string>;
  totalSupply: () => Promise<bigint>;
  transfer: (arg_0: Principal, arg_1: bigint) => Promise<TxReceipt>;
  transferFrom: (arg_0: Principal, arg_1: Principal, arg_2: bigint) => Promise<TxReceipt>;
  withdraw: (arg_0: bigint, arg_1: string) => Promise<TxReceipt>;
}
