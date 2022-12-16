export const rootFactory = ({ IDL }: { IDL: any }) => {
  const DetailValue = IDL.Rec();
  const WithIdArg = IDL.Record({ id: IDL.Nat64, witness: IDL.Bool });
  const Witness = IDL.Record({
    certificate: IDL.Vec(IDL.Nat8),
    tree: IDL.Vec(IDL.Nat8),
  });
  const GetBucketResponse = IDL.Record({
    witness: IDL.Opt(Witness),
    canister: IDL.Principal,
  });
  const WithWitnessArg = IDL.Record({ witness: IDL.Bool });
  const GetNextCanistersResponse = IDL.Record({
    witness: IDL.Opt(Witness),
    canisters: IDL.Vec(IDL.Principal),
  });
  const GetTokenTransactionsArg = IDL.Record({
    token_id: IDL.Nat64,
    page: IDL.Opt(IDL.Nat32),
    witness: IDL.Bool,
  });
  DetailValue.fill(
    IDL.Variant({
      I64: IDL.Int64,
      U64: IDL.Nat64,
      Vec: IDL.Vec(DetailValue),
      Slice: IDL.Vec(IDL.Nat8),
      TokenIdU64: IDL.Nat64,
      Text: IDL.Text,
      True: IDL.Null,
      False: IDL.Null,
      Float: IDL.Float64,
      Principal: IDL.Principal,
    })
  );
  const Event = IDL.Record({
    time: IDL.Nat64,
    operation: IDL.Text,
    details: IDL.Vec(IDL.Tuple(IDL.Text, DetailValue)),
    caller: IDL.Principal,
  });
  const GetTransactionsResponseBorrowed = IDL.Record({
    data: IDL.Vec(Event),
    page: IDL.Nat32,
    witness: IDL.Opt(Witness),
  });
  const GetTransactionResponse = IDL.Variant({
    Delegate: IDL.Tuple(IDL.Principal, IDL.Opt(Witness)),
    Found: IDL.Tuple(IDL.Opt(Event), IDL.Opt(Witness)),
  });
  const GetTransactionsArg = IDL.Record({
    page: IDL.Opt(IDL.Nat32),
    witness: IDL.Bool,
  });
  const GetUserTransactionsArg = IDL.Record({
    page: IDL.Opt(IDL.Nat32),
    user: IDL.Principal,
    witness: IDL.Bool,
  });
  const IndefiniteEvent = IDL.Record({
    operation: IDL.Text,
    details: IDL.Vec(IDL.Tuple(IDL.Text, DetailValue)),
    caller: IDL.Principal,
  });
  return IDL.Service({
    balance: IDL.Func([], [IDL.Nat64], ["query"]),
    contract_id: IDL.Func([], [IDL.Principal], ["query"]),
    get_bucket_for: IDL.Func([WithIdArg], [GetBucketResponse], ["query"]),
    get_next_canisters: IDL.Func(
      [WithWitnessArg],
      [GetNextCanistersResponse],
      ["query"]
    ),
    get_token_transactions: IDL.Func(
      [GetTokenTransactionsArg],
      [GetTransactionsResponseBorrowed],
      ["query"]
    ),
    get_transaction: IDL.Func([WithIdArg], [GetTransactionResponse], ["query"]),
    get_transactions: IDL.Func(
      [GetTransactionsArg],
      [GetTransactionsResponseBorrowed],
      ["query"]
    ),
    get_user_transactions: IDL.Func(
      [GetUserTransactionsArg],
      [GetTransactionsResponseBorrowed],
      ["query"]
    ),
    insert: IDL.Func([IndefiniteEvent], [IDL.Nat64], []),
    migrate: IDL.Func([IDL.Vec(Event)], [], []),
    size: IDL.Func([], [IDL.Nat64], ["query"]),
    time: IDL.Func([], [IDL.Nat64], ["query"]),
  });
};