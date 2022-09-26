import type { Principal } from "@dfinity/principal"

export type BurnError =
  { InsufficientBalance: null }
  | { InvalidTokenContract: null }
  | { NotSufficientLiquidity: null };
export type BurnResult = { Ok: TransactionId } | { Err: BurnError };
export type CreateResult = { Ok: { canister_id: Principal } } | { Err: string };

export interface Event {
  fee: bigint;
  status: TransactionStatus;
  kind: EventDetail;
  cycles: bigint;
  timestamp: bigint;
}

export type EventDetail =
  | {
  Approve: { to: Principal; from: Principal };
}
  | { Burn: { to: Principal; from: Principal } }
  | { Mint: { to: Principal } }
  | { CanisterCreated: { from: Principal; canister: Principal } }
  | {
  CanisterCalled: {
    from: Principal;
    method_name: string;
    canister: Principal;
  };
}
  | { Transfer: { to: Principal; from: Principal } }
  | {
  TransferFrom: {
    to: Principal;
    from: Principal;
    caller: Principal;
  };
};

export interface EventsConnection {
  data: Array<Event>;
  next_offset: TransactionId;
  next_canister_id: [] | [Principal];
}

export interface Metadata {
  fee: bigint;
  decimals: number;
  owner: Principal;
  logo: string;
  name: string;
  totalSupply: bigint;
  symbol: string;
}

export type MintError = { NotSufficientLiquidity: null };
export type MintResult = { Ok: TransactionId } | { Err: MintError };
export type Operation =
  | { transferFrom: null }
  | { burn: null }
  | { mint: null }
  | { approve: null }
  | { canisterCalled: null }
  | { transfer: null }
  | { canisterCreated: null };
export type ResultCall = { Ok: { return: Array<number> } } | { Err: string };
export type ResultSend = { Ok: null } | { Err: string };

export interface Stats {
  fee: bigint;
  transfers_count: bigint;
  balance: bigint;
  mints_count: bigint;
  transfers_from_count: bigint;
  canisters_created_count: bigint;
  supply: bigint;
  burns_count: bigint;
  approvals_count: bigint;
  proxy_calls_count: bigint;
  history_events: bigint;
}

export type Time = bigint;
export type TransactionId = bigint;
export type TransactionStatus = { FAILED: null } | { SUCCEEDED: null };
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

export interface TxRecord {
  op: Operation;
  to: Principal;
  fee: bigint;
  status: TransactionStatus;
  from: Principal;
  timestamp: Time;
  caller: [] | [Principal];
  index: bigint;
  amount: bigint;
}

export default interface _SERVICE {
  allowance: (arg_0: Principal, arg_1: Principal) => Promise<bigint>;
  approve: (arg_0: Principal, arg_1: bigint) => Promise<TxReceipt>;
  balance: (arg_0: [] | [Principal]) => Promise<bigint>;
  balanceOf: (arg_0: Principal) => Promise<bigint>;
  burn: (arg_0: { canister_id: Principal; amount: bigint }) => Promise<BurnResult>;
  decimals: () => Promise<number>;
  events: (arg_0: { offset: [] | [bigint]; limit: number }) => Promise<EventsConnection>;
  getMetadata: () => Promise<Metadata>;
  getTransaction: (arg_0: bigint) => Promise<TxRecord>;
  getTransactions: (arg_0: bigint, arg_1: bigint) => Promise<Array<TxRecord>>;
  get_transaction: (arg_0: TransactionId) => Promise<[] | [Event]>;
  halt: () => Promise<undefined>;
  historySize: () => Promise<bigint>;
  logo: () => Promise<string>;
  mint: (arg_0: Principal, arg_1: bigint) => Promise<MintResult>;
  name: () => Promise<string>;
  nameErc20: () => Promise<string>;
  stats: () => Promise<Stats>;
  symbol: () => Promise<string>;
  totalSupply: () => Promise<bigint>;
  transfer: (arg_0: Principal, arg_1: bigint) => Promise<TxReceipt>;
  transferErc20: (arg_0: Principal, arg_1: bigint) => Promise<TxReceipt>;
  transferFrom: (arg_0: Principal, arg_1: Principal, arg_2: bigint) => Promise<TxReceipt>;
  wallet_balance: () => Promise<{ amount: bigint }>;
  wallet_call: (arg_0: { args: Array<number>; cycles: bigint; method_name: string; canister: Principal }) => Promise<ResultCall>;
  wallet_create_canister: (arg_0: { controller: [] | [Principal]; cycles: bigint }) => Promise<CreateResult>;
  wallet_create_wallet: (arg_0: { controller: [] | [Principal]; cycles: bigint }) => Promise<CreateResult>;
  wallet_send: (arg_0: { canister: Principal; amount: bigint }) => Promise<ResultSend>;
}
