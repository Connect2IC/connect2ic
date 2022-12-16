import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Account {
  'owner' : Principal,
  'subaccount' : [] | [Subaccount],
}
export interface Allowance {
  'allowance' : bigint,
  'expires_at' : [] | [bigint],
}
export type ApproveError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'Duplicate' : { 'duplicate_of' : TxIndex } } |
  { 'BadFee' : { 'expected_fee' : Tokens } } |
  { 'CreatedInFuture' : { 'ledger_time' : Timestamp } } |
  { 'TooOld' : null } |
  { 'Expired' : { 'ledger_time' : bigint } } |
  { 'InsufficientFunds' : { 'balance' : Tokens } };
export interface Ledger {
  'icrc1_balance_of' : ActorMethod<[Account], Tokens>,
  'icrc1_decimals' : ActorMethod<[], number>,
  'icrc1_fee' : ActorMethod<[], bigint>,
  'icrc1_metadata' : ActorMethod<[], Array<[string, Value]>>,
  'icrc1_minting_account' : ActorMethod<[], [] | [Account]>,
  'icrc1_name' : ActorMethod<[], string>,
  'icrc1_supported_standards' : ActorMethod<
    [],
    Array<{ 'url' : string, 'name' : string }>
  >,
  'icrc1_symbol' : ActorMethod<[], string>,
  'icrc1_total_supply' : ActorMethod<[], Tokens>,
  'icrc1_transfer' : ActorMethod<
    [
      {
        'to' : Account,
        'fee' : [] | [Tokens],
        'memo' : [] | [Memo],
        'from_subaccount' : [] | [Subaccount],
        'created_at_time' : [] | [Timestamp],
        'amount' : Tokens,
      },
    ],
    Result_2
  >,
  'icrc2_allowance' : ActorMethod<
    [{ 'account' : Account, 'spender' : Principal }],
    Allowance
  >,
  'icrc2_approve' : ActorMethod<
    [
      {
        'fee' : [] | [Tokens],
        'memo' : [] | [Memo],
        'from_subaccount' : [] | [Subaccount],
        'created_at_time' : [] | [Timestamp],
        'amount' : bigint,
        'expires_at' : [] | [bigint],
        'spender' : Principal,
      },
    ],
    Result_1
  >,
  'icrc2_transfer_from' : ActorMethod<
    [
      {
        'to' : Account,
        'fee' : [] | [Tokens],
        'from' : Account,
        'memo' : [] | [Memo],
        'created_at_time' : [] | [Timestamp],
        'amount' : Tokens,
      },
    ],
    Result
  >,
}
export type Memo = Uint8Array;
export type Result = { 'Ok' : TxIndex } |
  { 'Err' : TransferFromError };
export type Result_1 = { 'Ok' : TxIndex } |
  { 'Err' : ApproveError };
export type Result_2 = { 'Ok' : TxIndex } |
  { 'Err' : TransferError };
export type Subaccount = Uint8Array;
export type Timestamp = bigint;
export type Tokens = bigint;
export type TransferError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'BadBurn' : { 'min_burn_amount' : Tokens } } |
  { 'Duplicate' : { 'duplicate_of' : TxIndex } } |
  { 'BadFee' : { 'expected_fee' : Tokens } } |
  { 'CreatedInFuture' : { 'ledger_time' : Timestamp } } |
  { 'TooOld' : null } |
  { 'InsufficientFunds' : { 'balance' : Tokens } };
export type TransferFromError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'InsufficientAllowance' : { 'allowance' : bigint } } |
  { 'BadBurn' : { 'min_burn_amount' : Tokens } } |
  { 'Duplicate' : { 'duplicate_of' : TxIndex } } |
  { 'BadFee' : { 'expected_fee' : Tokens } } |
  { 'CreatedInFuture' : { 'ledger_time' : Timestamp } } |
  { 'TooOld' : null } |
  { 'InsufficientFunds' : { 'balance' : Tokens } };
export type TxIndex = bigint;
export type Value = { 'Int' : bigint } |
  { 'Nat' : bigint } |
  { 'Blob' : Uint8Array } |
  { 'Text' : string };
export interface _SERVICE extends Ledger {}
