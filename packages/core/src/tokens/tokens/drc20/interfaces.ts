import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Account {
  'owner' : Principal,
  'subaccount' : [] | [Subaccount],
}
export type AccountId = Uint8Array;
export interface Account__1 {
  'owner' : Principal,
  'subaccount' : [] | [Subaccount],
}
export type Address = string;
export type Address__1 = string;
export interface AllowanceArgs { 'account' : Account, 'spender' : Principal }
export interface ApproveArgs {
  'fee' : [] | [bigint],
  'memo' : [] | [Uint8Array],
  'from_subaccount' : [] | [Uint8Array],
  'created_at_time' : [] | [bigint],
  'amount' : bigint,
  'spender' : Principal,
}
export type ApproveError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'Duplicate' : { 'duplicate_of' : bigint } } |
  { 'BadFee' : { 'expected_fee' : bigint } } |
  { 'CreatedInFuture' : { 'ledger_time' : bigint } } |
  { 'TooOld' : null } |
  { 'InsufficientFunds' : { 'balance' : bigint } };
export interface DRC20 {
  'drc202_canisterId' : ActorMethod<[], Principal>,
  'drc202_events' : ActorMethod<[[] | [Address__1]], Array<TxnRecord>>,
  'drc202_getConfig' : ActorMethod<[], Setting>,
  'drc202_pool' : ActorMethod<[], Array<[Txid, bigint]>>,
  'drc202_txn' : ActorMethod<[Txid], [] | [TxnRecord]>,
  'drc202_txn2' : ActorMethod<[Txid], [] | [TxnRecord]>,
  'icrc1_balance_of' : ActorMethod<[Account__1], bigint>,
  'icrc1_decimals' : ActorMethod<[], number>,
  'icrc1_fee' : ActorMethod<[], bigint>,
  'icrc1_metadata' : ActorMethod<[], Array<[string, Value]>>,
  'icrc1_minting_account' : ActorMethod<[], Account__1>,
  'icrc1_name' : ActorMethod<[], string>,
  'icrc1_supported_standards' : ActorMethod<
    [],
    Array<{ 'url' : string, 'name' : string }>
  >,
  'icrc1_symbol' : ActorMethod<[], string>,
  'icrc1_total_supply' : ActorMethod<[], bigint>,
  'icrc1_transfer' : ActorMethod<
    [TransferArgs],
    { 'Ok' : bigint } |
      { 'Err' : TransferError }
  >,
  'icrc2_allowance' : ActorMethod<[AllowanceArgs], bigint>,
  'icrc2_approve' : ActorMethod<
    [ApproveArgs],
    { 'Ok' : bigint } |
      { 'Err' : ApproveError }
  >,
  'icrc2_transfer_from' : ActorMethod<
    [TransferFromArgs],
    { 'Ok' : bigint } |
      { 'Err' : TransferFromError }
  >,
  'wallet_receive' : ActorMethod<[], undefined>,
}
export type Duration = bigint;
export type Gas = { 'token' : bigint } |
  { 'cycles' : bigint } |
  { 'noFee' : null };
export interface InitArgs {
  'fee' : bigint,
  'decimals' : number,
  'metadata' : [] | [Array<Metadata>],
  'name' : [] | [string],
  'totalSupply' : bigint,
  'founder' : [] | [Address],
  'symbol' : [] | [string],
}
export interface Metadata { 'content' : string, 'name' : string }
export type Operation = { 'approve' : { 'allowance' : bigint } } |
  {
    'lockTransfer' : {
      'locked' : bigint,
      'expiration' : Time,
      'decider' : AccountId,
    }
  } |
  {
    'transfer' : {
      'action' : { 'burn' : null } |
        { 'mint' : null } |
        { 'send' : null },
    }
  } |
  { 'executeTransfer' : { 'fallback' : bigint, 'lockedTxid' : Txid__1 } };
export interface Setting {
  'MAX_STORAGE_TRIES' : bigint,
  'EN_DEBUG' : boolean,
  'MAX_CACHE_NUMBER_PER' : bigint,
  'MAX_CACHE_TIME' : bigint,
}
export type Subaccount = Uint8Array;
export type Time = bigint;
export type Timestamp = bigint;
export interface Transaction {
  'to' : AccountId,
  'value' : bigint,
  'data' : [] | [Uint8Array],
  'from' : AccountId,
  'operation' : Operation,
}
export interface TransferArgs {
  'to' : Account,
  'fee' : [] | [bigint],
  'memo' : [] | [Uint8Array],
  'from_subaccount' : [] | [Subaccount],
  'created_at_time' : [] | [Timestamp],
  'amount' : bigint,
}
export type TransferError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'BadBurn' : { 'min_burn_amount' : bigint } } |
  { 'Duplicate' : { 'duplicate_of' : bigint } } |
  { 'BadFee' : { 'expected_fee' : bigint } } |
  { 'CreatedInFuture' : null } |
  { 'TooOld' : { 'allowed_window_nanos' : Duration } } |
  { 'InsufficientFunds' : { 'balance' : bigint } };
export interface TransferFromArgs {
  'to' : Account,
  'fee' : [] | [bigint],
  'from' : Account,
  'memo' : [] | [Uint8Array],
  'created_at_time' : [] | [bigint],
  'amount' : bigint,
}
export type TransferFromError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'InsufficientAllowance' : { 'allowance' : bigint } } |
  { 'BadBurn' : { 'min_burn_amount' : bigint } } |
  { 'Duplicate' : { 'duplicate_of' : bigint } } |
  { 'BadFee' : { 'expected_fee' : bigint } } |
  { 'CreatedInFuture' : { 'ledger_time' : bigint } } |
  { 'TooOld' : null } |
  { 'InsufficientFunds' : { 'balance' : bigint } };
export type Txid = Uint8Array;
export type Txid__1 = Uint8Array;
export interface TxnRecord {
  'gas' : Gas,
  'msgCaller' : [] | [Principal],
  'transaction' : Transaction,
  'txid' : Txid__1,
  'nonce' : bigint,
  'timestamp' : Time,
  'caller' : AccountId,
  'index' : bigint,
}
export type Value = { 'Int' : bigint } |
  { 'Nat' : bigint } |
  { 'Blob' : Uint8Array } |
  { 'Text' : string };
export interface _SERVICE extends DRC20 {}
