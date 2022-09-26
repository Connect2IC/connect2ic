import type { Principal } from "@dfinity/principal"

export interface Attribute {
  key: string;
  value: string;
}

export type Errors = { Unauthorized: null } | { TokenNotExist: null } | { InvalidOperator: null };
export type Location =
  { Web: string }
  | { AssetCanister: [Principal, Array<number>] }
  | { IPFS: string }
  | { InCanister: Array<number> };

export interface Metadata {
  owner: Principal;
  desc: string;
  logo: string;
  name: string;
  totalSupply: bigint;
  cycles: bigint;
  symbol: string;
}

export type MintResult = { Ok: [bigint, bigint] } | { Err: Errors };

export interface NFToken {
  approve: (arg_0: bigint, arg_1: Principal) => Promise<TxReceipt>;
  balanceOf: (arg_0: Principal) => Promise<bigint>;
  batchMint: (arg_0: Principal, arg_1: Array<[] | [TokenMetadata]>) => Promise<MintResult>;
  batchTransferFrom: (arg_0: Principal, arg_1: Principal, arg_2: Array<bigint>) => Promise<TxReceipt>;
  burn: (arg_0: bigint) => Promise<TxReceipt>;
  desc: () => Promise<string>;
  getAllTokens: () => Promise<Array<TokenInfoExt>>;
  getMetadata: () => Promise<Metadata>;
  getOperator: (arg_0: bigint) => Promise<Result>;
  getTokenInfo: (arg_0: bigint) => Promise<Result_2>;
  getTransaction: (arg_0: bigint) => Promise<TxRecord>;
  getTransactions: (arg_0: bigint, arg_1: bigint) => Promise<Array<TxRecord>>;
  getUserInfo: (arg_0: Principal) => Promise<Result_1>;
  getUserTokens: (arg_0: Principal) => Promise<Array<TokenInfoExt>>;
  getUserTransactionAmount: (arg_0: Principal) => Promise<bigint>;
  getUserTransactions: (arg_0: Principal, arg_1: bigint, arg_2: bigint) => Promise<Array<TxRecord>>;
  historySize: () => Promise<bigint>;
  isApprovedForAll: (arg_0: Principal, arg_1: Principal) => Promise<boolean>;
  logo: () => Promise<string>;
  mint: (arg_0: Principal, arg_1: [] | [TokenMetadata]) => Promise<MintResult>;
  name: () => Promise<string>;
  ownerOf: (arg_0: bigint) => Promise<Result>;
  setApprovalForAll: (arg_0: Principal, arg_1: boolean) => Promise<TxReceipt>;
  setOwner: (arg_0: Principal) => Promise<Principal>;
  setTokenMetadata: (arg_0: bigint, arg_1: TokenMetadata) => Promise<TxReceipt>;
  symbol: () => Promise<string>;
  totalSupply: () => Promise<bigint>;
  transfer: (arg_0: Principal, arg_1: bigint) => Promise<TxReceipt>;
  transferFrom: (arg_0: Principal, arg_1: Principal, arg_2: bigint) => Promise<TxReceipt>;
}

export type Operation =
  | { transferFrom: null }
  | { burn: null }
  | { approveAll: null }
  | { mint: [] | [TokenMetadata__1] }
  | { approve: null }
  | { setMetadata: null }
  | { transfer: null }
  | { revokeAll: null };
export type Record = { metadata: [] | [TokenMetadata__1] } | { user: Principal };
export type Result = { ok: Principal } | { err: Errors };
export type Result_1 = { ok: UserInfoExt } | { err: Errors };
export type Result_2 = { ok: TokenInfoExt } | { err: Errors };
export type Time = bigint;

export interface TokenInfoExt {
  owner: Principal;
  metadata: [] | [TokenMetadata__1];
  operator: [] | [Principal];
  timestamp: Time;
  index: bigint;
}

export interface TokenMetadata {
  filetype: string;
  attributes: Array<Attribute>;
  location: Location;
}

export interface TokenMetadata__1 {
  filetype: string;
  attributes: Array<Attribute>;
  location: Location;
}

export type TxReceipt = { Ok: bigint } | { Err: Errors };

export interface TxRecord {
  op: Operation;
  to: Record;
  tokenIndex: [] | [bigint];
  from: Record;
  timestamp: Time;
  caller: Principal;
  index: bigint;
}

export interface UserInfoExt {
  allowedTokens: Array<bigint>;
  tokens: Array<bigint>;
  operators: Array<Principal>;
  allowedBy: Array<Principal>;
}

export interface _SERVICE extends NFToken {
}
