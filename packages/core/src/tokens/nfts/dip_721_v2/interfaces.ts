import type { Principal } from "@dfinity/principal"

export type GenericValue =
  | { Nat64Content: bigint }
  | { Nat32Content: number }
  | { BoolContent: boolean }
  | { Nat8Content: number }
  | { Int64Content: bigint }
  | { IntContent: bigint }
  | { NatContent: bigint }
  | { Nat16Content: number }
  | { Int32Content: number }
  | { Int8Content: number }
  | { FloatContent: number }
  | { Int16Content: number }
  | { BlobContent: Array<number> }
  | { NestedContent: Vec }
  | { Principal: Principal }
  | { TextContent: string };

export interface InitArgs {
  logo: [] | [string];
  name: [] | [string];
  custodians: [] | [Array<Principal>];
  symbol: [] | [string];
}

export interface ManualReply {
  logo: [] | [string];
  name: [] | [string];
  created_at: bigint;
  upgraded_at: bigint;
  custodians: Array<Principal>;
  symbol: [] | [string];
}

export type ManualReply_1 = { Ok: Array<bigint> } | { Err: NftError };
export type ManualReply_2 = { Ok: Array<TokenMetadata> } | { Err: NftError };
export type ManualReply_3 = { Ok: TokenMetadata } | { Err: NftError };
export type ManualReply_4 = { Ok: TxEvent } | { Err: NftError };
export type NftError =
  | { UnauthorizedOperator: null }
  | { SelfTransfer: null }
  | { TokenNotFound: null }
  | { UnauthorizedOwner: null }
  | { TxNotFound: null }
  | { SelfApprove: null }
  | { OperatorNotFound: null }
  | { ExistedNFT: null }
  | { OwnerNotFound: null }
  | { Other: string };
export type Result = { Ok: bigint } | { Err: NftError };
export type Result_1 = { Ok: boolean } | { Err: NftError };
export type Result_2 = { Ok: [] | [Principal] } | { Err: NftError };

export interface Stats {
  cycles: bigint;
  total_transactions: bigint;
  total_unique_holders: bigint;
  total_supply: bigint;
}

export type SupportedInterface = { Burn: null } | { Mint: null } | { Approval: null } | { TransactionHistory: null };

export interface TokenMetadata {
  transferred_at: [] | [bigint];
  transferred_by: [] | [Principal];
  owner: [] | [Principal];
  operator: [] | [Principal];
  approved_at: [] | [bigint];
  approved_by: [] | [Principal];
  properties: Array<[string, GenericValue]>;
  is_burned: boolean;
  token_identifier: bigint;
  burned_at: [] | [bigint];
  burned_by: [] | [Principal];
  minted_at: bigint;
  minted_by: Principal;
}

export interface TxEvent {
  time: bigint;
  operation: string;
  details: Array<[string, GenericValue]>;
  caller: Principal;
}

export type Vec = Array<[
  string,
  (
    | { Nat64Content: bigint }
    | { Nat32Content: number }
    | { BoolContent: boolean }
    | { Nat8Content: number }
    | { Int64Content: bigint }
    | { IntContent: bigint }
    | { NatContent: bigint }
    | { Nat16Content: number }
    | { Int32Content: number }
    | { Int8Content: number }
    | { FloatContent: number }
    | { Int16Content: number }
    | { BlobContent: Array<number> }
    | { NestedContent: Vec }
    | { Principal: Principal }
    | { TextContent: string }
    ),
]>;
export default interface _SERVICE {
  approve: (arg_0: Principal, arg_1: bigint) => Promise<Result>;
  balanceOf: (arg_0: Principal) => Promise<Result>;
  burn: (arg_0: bigint) => Promise<Result>;
  custodians: () => Promise<Array<Principal>>;
  cycles: () => Promise<bigint>;
  isApprovedForAll: (arg_0: Principal, arg_1: Principal) => Promise<Result_1>;
  logo: () => Promise<[] | [string]>;
  metadata: () => Promise<ManualReply>;
  mint: (arg_0: Principal, arg_1: bigint, arg_2: Array<[string, GenericValue]>) => Promise<Result>;
  name: () => Promise<[] | [string]>;
  operatorOf: (arg_0: bigint) => Promise<Result_2>;
  operatorTokenIdentifiers: (arg_0: Principal) => Promise<ManualReply_1>;
  operatorTokenMetadata: (arg_0: Principal) => Promise<ManualReply_2>;
  ownerOf: (arg_0: bigint) => Promise<Result_2>;
  ownerTokenIdentifiers: (arg_0: Principal) => Promise<ManualReply_1>;
  ownerTokenMetadata: (arg_0: Principal) => Promise<ManualReply_2>;
  setApprovalForAll: (arg_0: Principal, arg_1: boolean) => Promise<Result>;
  setCustodians: (arg_0: Array<Principal>) => Promise<undefined>;
  setLogo: (arg_0: string) => Promise<undefined>;
  setName: (arg_0: string) => Promise<undefined>;
  setSymbol: (arg_0: string) => Promise<undefined>;
  stats: () => Promise<Stats>;
  supportedInterfaces: () => Promise<Array<SupportedInterface>>;
  symbol: () => Promise<[] | [string]>;
  tokenMetadata: (arg_0: bigint) => Promise<ManualReply_3>;
  totalSupply: () => Promise<bigint>;
  totalTransactions: () => Promise<bigint>;
  totalUniqueHolders: () => Promise<bigint>;
  transaction: (arg_0: bigint) => Promise<ManualReply_4>;
  transfer: (arg_0: Principal, arg_1: bigint) => Promise<Result>;
  transferFrom: (arg_0: Principal, arg_1: Principal, arg_2: bigint) => Promise<Result>;
}
