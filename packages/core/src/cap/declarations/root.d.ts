import type { Principal } from "@dfinity/principal";

export type DetailValue =
  | { I64: bigint }
  | { U64: bigint }
  | { Vec: Array<DetailValue> }
  | { Slice: Array<number> }
  | { TokenIdU64: bigint }
  | { Text: string }
  | { True: null }
  | { False: null }
  | { Float: number }
  | { Principal: Principal };
export interface Event {
  time: bigint;
  operation: string;
  details: Array<[string, DetailValue]>;
  caller: Principal;
}
export interface GetBucketResponse {
  witness: [] | [Witness];
  canister: Principal;
}
export interface GetNextCanistersResponse {
  witness: [] | [Witness];
  canisters: Array<Principal>;
}
export interface GetTokenTransactionsArg {
  token_id: bigint;
  page: [] | [number];
  witness: boolean;
}
export type GetTransactionResponse =
  | {
  Delegate: [Principal, [] | [Witness]];
}
  | { Found: [[] | [Event], [] | [Witness]] };
export interface GetTransactionsArg {
  page: [] | [number];
  witness: boolean;
}
export interface GetTransactionsResponseBorrowed {
  data: Array<Event>;
  page: number;
  witness: [] | [Witness];
}
export interface GetUserTransactionsArg {
  page: [] | [number];
  user: Principal;
  witness: boolean;
}
export interface IndefiniteEvent {
  operation: string;
  details: Array<[string, DetailValue]>;
  caller: Principal;
}
export interface WithIdArg {
  id: bigint;
  witness: boolean;
}
export interface WithWitnessArg {
  witness: boolean;
}
export interface Witness {
  certificate: Array<number>;
  tree: Array<number>;
}
export default interface _SERVICE {
  balance: () => Promise<bigint>;
  contract_id: () => Promise<Principal>;
  get_bucket_for: (arg_0: WithIdArg) => Promise<GetBucketResponse>;
  get_next_canisters: (
    arg_0: WithWitnessArg
  ) => Promise<GetNextCanistersResponse>;
  get_token_transactions: (
    arg_0: GetTokenTransactionsArg
  ) => Promise<GetTransactionsResponseBorrowed>;
  get_transaction: (arg_0: WithIdArg) => Promise<GetTransactionResponse>;
  get_transactions: (
    arg_0: GetTransactionsArg
  ) => Promise<GetTransactionsResponseBorrowed>;
  get_user_transactions: (
    arg_0: GetUserTransactionsArg
  ) => Promise<GetTransactionsResponseBorrowed>;
  insert: (arg_0: IndefiniteEvent) => Promise<bigint>;
  migrate: (arg_0: Array<Event>) => Promise<undefined>;
  size: () => Promise<bigint>;
  time: () => Promise<bigint>;
}