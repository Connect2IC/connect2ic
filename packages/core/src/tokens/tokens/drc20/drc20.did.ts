export const idlFactory = ({ IDL }) => {
  const Metadata = IDL.Record({ 'content' : IDL.Text, 'name' : IDL.Text });
  const Address = IDL.Text;
  const InitArgs = IDL.Record({
    'fee' : IDL.Nat,
    'decimals' : IDL.Nat8,
    'metadata' : IDL.Opt(IDL.Vec(Metadata)),
    'name' : IDL.Opt(IDL.Text),
    'totalSupply' : IDL.Nat,
    'founder' : IDL.Opt(Address),
    'symbol' : IDL.Opt(IDL.Text),
  });
  const Address__1 = IDL.Text;
  const Gas = IDL.Variant({
    'token' : IDL.Nat,
    'cycles' : IDL.Nat,
    'noFee' : IDL.Null,
  });
  const AccountId = IDL.Vec(IDL.Nat8);
  const Time = IDL.Int;
  const Txid__1 = IDL.Vec(IDL.Nat8);
  const Operation = IDL.Variant({
    'approve' : IDL.Record({ 'allowance' : IDL.Nat }),
    'lockTransfer' : IDL.Record({
      'locked' : IDL.Nat,
      'expiration' : Time,
      'decider' : AccountId,
    }),
    'transfer' : IDL.Record({
      'action' : IDL.Variant({
        'burn' : IDL.Null,
        'mint' : IDL.Null,
        'send' : IDL.Null,
      }),
    }),
    'executeTransfer' : IDL.Record({
      'fallback' : IDL.Nat,
      'lockedTxid' : Txid__1,
    }),
  });
  const Transaction = IDL.Record({
    'to' : AccountId,
    'value' : IDL.Nat,
    'data' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from' : AccountId,
    'operation' : Operation,
  });
  const TxnRecord = IDL.Record({
    'gas' : Gas,
    'msgCaller' : IDL.Opt(IDL.Principal),
    'transaction' : Transaction,
    'txid' : Txid__1,
    'nonce' : IDL.Nat,
    'timestamp' : Time,
    'caller' : AccountId,
    'index' : IDL.Nat,
  });
  const Setting = IDL.Record({
    'MAX_STORAGE_TRIES' : IDL.Nat,
    'EN_DEBUG' : IDL.Bool,
    'MAX_CACHE_NUMBER_PER' : IDL.Nat,
    'MAX_CACHE_TIME' : IDL.Nat,
  });
  const Txid = IDL.Vec(IDL.Nat8);
  const Subaccount = IDL.Vec(IDL.Nat8);
  const Account__1 = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(Subaccount),
  });
  const Value = IDL.Variant({
    'Int' : IDL.Int,
    'Nat' : IDL.Nat,
    'Blob' : IDL.Vec(IDL.Nat8),
    'Text' : IDL.Text,
  });
  const Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(Subaccount),
  });
  const Timestamp = IDL.Nat64;
  const TransferArgs = IDL.Record({
    'to' : Account,
    'fee' : IDL.Opt(IDL.Nat),
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from_subaccount' : IDL.Opt(Subaccount),
    'created_at_time' : IDL.Opt(Timestamp),
    'amount' : IDL.Nat,
  });
  const Duration = IDL.Nat64;
  const TransferError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'BadBurn' : IDL.Record({ 'min_burn_amount' : IDL.Nat }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat }),
    'BadFee' : IDL.Record({ 'expected_fee' : IDL.Nat }),
    'CreatedInFuture' : IDL.Null,
    'TooOld' : IDL.Record({ 'allowed_window_nanos' : Duration }),
    'InsufficientFunds' : IDL.Record({ 'balance' : IDL.Nat }),
  });
  const AllowanceArgs = IDL.Record({
    'account' : Account,
    'spender' : IDL.Principal,
  });
  const ApproveArgs = IDL.Record({
    'fee' : IDL.Opt(IDL.Nat),
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from_subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Nat64),
    'amount' : IDL.Nat,
    'spender' : IDL.Principal,
  });
  const ApproveError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'Duplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat }),
    'BadFee' : IDL.Record({ 'expected_fee' : IDL.Nat }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'TooOld' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : IDL.Nat }),
  });
  const TransferFromArgs = IDL.Record({
    'to' : Account,
    'fee' : IDL.Opt(IDL.Nat),
    'from' : Account,
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Nat64),
    'amount' : IDL.Nat,
  });
  const TransferFromError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'InsufficientAllowance' : IDL.Record({ 'allowance' : IDL.Nat }),
    'BadBurn' : IDL.Record({ 'min_burn_amount' : IDL.Nat }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat }),
    'BadFee' : IDL.Record({ 'expected_fee' : IDL.Nat }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'TooOld' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : IDL.Nat }),
  });
  const DRC20 = IDL.Service({
    'drc202_canisterId' : IDL.Func([], [IDL.Principal], ['query']),
    'drc202_events' : IDL.Func(
        [IDL.Opt(Address__1)],
        [IDL.Vec(TxnRecord)],
        ['query'],
      ),
    'drc202_getConfig' : IDL.Func([], [Setting], ['query']),
    'drc202_pool' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(Txid, IDL.Nat))],
        ['query'],
      ),
    'drc202_txn' : IDL.Func([Txid], [IDL.Opt(TxnRecord)], ['query']),
    'drc202_txn2' : IDL.Func([Txid], [IDL.Opt(TxnRecord)], []),
    'icrc1_balance_of' : IDL.Func([Account__1], [IDL.Nat], ['query']),
    'icrc1_decimals' : IDL.Func([], [IDL.Nat8], ['query']),
    'icrc1_fee' : IDL.Func([], [IDL.Nat], ['query']),
    'icrc1_metadata' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, Value))],
        ['query'],
      ),
    'icrc1_minting_account' : IDL.Func([], [Account__1], ['query']),
    'icrc1_name' : IDL.Func([], [IDL.Text], ['query']),
    'icrc1_supported_standards' : IDL.Func(
        [],
        [IDL.Vec(IDL.Record({ 'url' : IDL.Text, 'name' : IDL.Text }))],
        ['query'],
      ),
    'icrc1_symbol' : IDL.Func([], [IDL.Text], ['query']),
    'icrc1_total_supply' : IDL.Func([], [IDL.Nat], ['query']),
    'icrc1_transfer' : IDL.Func(
        [TransferArgs],
        [IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : TransferError })],
        [],
      ),
    'icrc2_allowance' : IDL.Func([AllowanceArgs], [IDL.Nat], ['query']),
    'icrc2_approve' : IDL.Func(
        [ApproveArgs],
        [IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : ApproveError })],
        [],
      ),
    'icrc2_transfer_from' : IDL.Func(
        [TransferFromArgs],
        [IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : TransferFromError })],
        [],
      ),
    'wallet_receive' : IDL.Func([], [], []),
  });
  return DRC20;
};
export const init = ({ IDL }) => {
  const Metadata = IDL.Record({ 'content' : IDL.Text, 'name' : IDL.Text });
  const Address = IDL.Text;
  const InitArgs = IDL.Record({
    'fee' : IDL.Nat,
    'decimals' : IDL.Nat8,
    'metadata' : IDL.Opt(IDL.Vec(Metadata)),
    'name' : IDL.Opt(IDL.Text),
    'totalSupply' : IDL.Nat,
    'founder' : IDL.Opt(Address),
    'symbol' : IDL.Opt(IDL.Text),
  });
  return [InitArgs];
};
