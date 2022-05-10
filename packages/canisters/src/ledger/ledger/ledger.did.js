export const idlFactory = ({ IDL }) => {
  const AccountIdentifier = IDL.Text;
  const Duration = IDL.Record({ 'secs' : IDL.Nat64, 'nanos' : IDL.Nat32 });
  const ArchiveOptions = IDL.Record({
    'max_message_size_bytes' : IDL.Opt(IDL.Nat32),
    'node_max_memory_size_bytes' : IDL.Opt(IDL.Nat32),
    'controller_id' : IDL.Principal,
  });
  const ICPTs = IDL.Record({ 'e8s' : IDL.Nat64 });
  const LedgerCanisterInitPayload = IDL.Record({
    'send_whitelist' : IDL.Vec(IDL.Tuple(IDL.Principal)),
    'minting_account' : AccountIdentifier,
    'transaction_window' : IDL.Opt(Duration),
    'max_message_size_bytes' : IDL.Opt(IDL.Nat32),
    'archive_options' : IDL.Opt(ArchiveOptions),
    'initial_values' : IDL.Vec(IDL.Tuple(AccountIdentifier, ICPTs)),
  });
  const AccountIdentifierNew = IDL.Vec(IDL.Nat8);
  const AccountBalanceArgsNew = IDL.Record({
    'account' : AccountIdentifierNew,
  });
  const Tokens = IDL.Record({ 'e8s' : IDL.Nat64 });
  const AccountBalanceArgs = IDL.Record({ 'account' : AccountIdentifier });
  const CanisterId = IDL.Principal;
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const HttpRequest = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
  });
  const HttpResponse = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
    'status_code' : IDL.Nat16,
  });
  const SubAccount = IDL.Vec(IDL.Nat8);
  const BlockHeight = IDL.Nat64;
  const NotifyCanisterArgs = IDL.Record({
    'to_subaccount' : IDL.Opt(SubAccount),
    'from_subaccount' : IDL.Opt(SubAccount),
    'to_canister' : IDL.Principal,
    'max_fee' : ICPTs,
    'block_height' : BlockHeight,
  });
  const Memo = IDL.Nat64;
  const TimeStamp = IDL.Record({ 'timestamp_nanos' : IDL.Nat64 });
  const SendArgs = IDL.Record({
    'to' : AccountIdentifier,
    'fee' : ICPTs,
    'memo' : Memo,
    'from_subaccount' : IDL.Opt(SubAccount),
    'created_at_time' : IDL.Opt(TimeStamp),
    'amount' : ICPTs,
  });
  const TransferArgs = IDL.Record({
    'to' : AccountIdentifierNew,
    'fee' : Tokens,
    'memo' : Memo,
    'from_subaccount' : IDL.Opt(SubAccount),
    'created_at_time' : IDL.Opt(TimeStamp),
    'amount' : Tokens,
  });
  const BlockIndex = IDL.Nat64;
  const TransferError = IDL.Variant({
    'TxTooOld' : IDL.Record({ 'allowed_window_nanos' : IDL.Nat64 }),
    'BadFee' : IDL.Record({ 'expected_fee' : Tokens }),
    'TxDuplicate' : IDL.Record({ 'duplicate_of' : BlockIndex }),
    'TxCreatedInFuture' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : Tokens }),
  });
  const TransferResult = IDL.Variant({
    'Ok' : BlockIndex,
    'Err' : TransferError,
  });
  return IDL.Service({
    'account_balance' : IDL.Func([AccountBalanceArgsNew], [Tokens], ['query']),
    'account_balance_dfx' : IDL.Func([AccountBalanceArgs], [ICPTs], ['query']),
    'get_nodes' : IDL.Func([], [IDL.Vec(CanisterId)], ['query']),
    'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
    'notify_dfx' : IDL.Func([NotifyCanisterArgs], [], []),
    'send_dfx' : IDL.Func([SendArgs], [BlockHeight], []),
    'transfer' : IDL.Func([TransferArgs], [TransferResult], []),
  });
};
export const init = ({ IDL }) => {
  const AccountIdentifier = IDL.Text;
  const Duration = IDL.Record({ 'secs' : IDL.Nat64, 'nanos' : IDL.Nat32 });
  const ArchiveOptions = IDL.Record({
    'max_message_size_bytes' : IDL.Opt(IDL.Nat32),
    'node_max_memory_size_bytes' : IDL.Opt(IDL.Nat32),
    'controller_id' : IDL.Principal,
  });
  const ICPTs = IDL.Record({ 'e8s' : IDL.Nat64 });
  const LedgerCanisterInitPayload = IDL.Record({
    'send_whitelist' : IDL.Vec(IDL.Tuple(IDL.Principal)),
    'minting_account' : AccountIdentifier,
    'transaction_window' : IDL.Opt(Duration),
    'max_message_size_bytes' : IDL.Opt(IDL.Nat32),
    'archive_options' : IDL.Opt(ArchiveOptions),
    'initial_values' : IDL.Vec(IDL.Tuple(AccountIdentifier, ICPTs)),
  });
  return [LedgerCanisterInitPayload];
};
