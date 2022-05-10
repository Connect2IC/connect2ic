import type { Principal } from '@dfinity/principal';
export interface AccountBalanceArgs { 'account' : AccountIdentifier }
export interface AccountBalanceArgsNew { 'account' : AccountIdentifierNew }
export type AccountIdentifier = string;
export type AccountIdentifierNew = Array<number>;
export interface ArchiveOptions {
  'max_message_size_bytes' : [] | [number],
  'node_max_memory_size_bytes' : [] | [number],
  'controller_id' : Principal,
}
export type BlockHeight = bigint;
export type BlockIndex = bigint;
export type CanisterId = Principal;
export interface Duration { 'secs' : bigint, 'nanos' : number }
export type HeaderField = [string, string];
export interface HttpRequest {
  'url' : string,
  'method' : string,
  'body' : Array<number>,
  'headers' : Array<HeaderField>,
}
export interface HttpResponse {
  'body' : Array<number>,
  'headers' : Array<HeaderField>,
  'status_code' : number,
}
export interface ICPTs { 'e8s' : bigint }
export interface LedgerCanisterInitPayload {
  'send_whitelist' : Array<[Principal]>,
  'minting_account' : AccountIdentifier,
  'transaction_window' : [] | [Duration],
  'max_message_size_bytes' : [] | [number],
  'archive_options' : [] | [ArchiveOptions],
  'initial_values' : Array<[AccountIdentifier, ICPTs]>,
}
export type Memo = bigint;
export interface NotifyCanisterArgs {
  'to_subaccount' : [] | [SubAccount],
  'from_subaccount' : [] | [SubAccount],
  'to_canister' : Principal,
  'max_fee' : ICPTs,
  'block_height' : BlockHeight,
}
export interface SendArgs {
  'to' : AccountIdentifier,
  'fee' : ICPTs,
  'memo' : Memo,
  'from_subaccount' : [] | [SubAccount],
  'created_at_time' : [] | [TimeStamp],
  'amount' : ICPTs,
}
export type SubAccount = Array<number>;
export interface TimeStamp { 'timestamp_nanos' : bigint }
export interface Tokens { 'e8s' : bigint }
export interface Transaction {
  'memo' : Memo,
  'created_at' : BlockHeight,
  'transfer' : Transfer,
}
export type Transfer = {
    'Burn' : { 'from' : AccountIdentifier, 'amount' : ICPTs }
  } |
  { 'Mint' : { 'to' : AccountIdentifier, 'amount' : ICPTs } } |
  {
    'Send' : {
      'to' : AccountIdentifier,
      'from' : AccountIdentifier,
      'amount' : ICPTs,
    }
  };
export interface TransferArgs {
  'to' : AccountIdentifierNew,
  'fee' : Tokens,
  'memo' : Memo,
  'from_subaccount' : [] | [SubAccount],
  'created_at_time' : [] | [TimeStamp],
  'amount' : Tokens,
}
export type TransferError = {
    'TxTooOld' : { 'allowed_window_nanos' : bigint }
  } |
  { 'BadFee' : { 'expected_fee' : Tokens } } |
  { 'TxDuplicate' : { 'duplicate_of' : BlockIndex } } |
  { 'TxCreatedInFuture' : null } |
  { 'InsufficientFunds' : { 'balance' : Tokens } };
export type TransferResult = { 'Ok' : BlockIndex } |
  { 'Err' : TransferError };
export interface _SERVICE {
  'account_balance' : (arg_0: AccountBalanceArgsNew) => Promise<Tokens>,
  'account_balance_dfx' : (arg_0: AccountBalanceArgs) => Promise<ICPTs>,
  'get_nodes' : () => Promise<Array<CanisterId>>,
  'http_request' : (arg_0: HttpRequest) => Promise<HttpResponse>,
  'notify_dfx' : (arg_0: NotifyCanisterArgs) => Promise<undefined>,
  'send_dfx' : (arg_0: SendArgs) => Promise<BlockHeight>,
  'transfer' : (arg_0: TransferArgs) => Promise<TransferResult>,
}
