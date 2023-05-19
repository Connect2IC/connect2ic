export const idlFactory = ({ IDL }) => {
  const Vec = IDL.Rec();
  const InitArgs = IDL.Record({
    'cap' : IDL.Opt(IDL.Principal),
    'logo' : IDL.Opt(IDL.Text),
    'name' : IDL.Opt(IDL.Text),
    'custodians' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'symbol' : IDL.Opt(IDL.Text),
  });
  const NftError = IDL.Variant({
    'UnauthorizedOperator' : IDL.Null,
    'SelfTransfer' : IDL.Null,
    'TokenNotFound' : IDL.Null,
    'UnauthorizedOwner' : IDL.Null,
    'SelfApprove' : IDL.Null,
    'OperatorNotFound' : IDL.Null,
    'ExistedNFT' : IDL.Null,
    'OwnerNotFound' : IDL.Null,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : NftError });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : NftError });
  const ManualReply = IDL.Record({
    'logo' : IDL.Opt(IDL.Text),
    'name' : IDL.Opt(IDL.Text),
    'created_at' : IDL.Nat64,
    'upgraded_at' : IDL.Nat64,
    'custodians' : IDL.Vec(IDL.Principal),
    'symbol' : IDL.Opt(IDL.Text),
  });
  Vec.fill(
    IDL.Vec(
      IDL.Tuple(
        IDL.Text,
        IDL.Variant({
          'Nat64Content' : IDL.Nat64,
          'Nat32Content' : IDL.Nat32,
          'BoolContent' : IDL.Bool,
          'Nat8Content' : IDL.Nat8,
          'Int64Content' : IDL.Int64,
          'IntContent' : IDL.Int,
          'NatContent' : IDL.Nat,
          'Nat16Content' : IDL.Nat16,
          'Int32Content' : IDL.Int32,
          'Int8Content' : IDL.Int8,
          'FloatContent' : IDL.Float64,
          'Int16Content' : IDL.Int16,
          'BlobContent' : IDL.Vec(IDL.Nat8),
          'NestedContent' : Vec,
          'Principal' : IDL.Principal,
          'TextContent' : IDL.Text,
        }),
      )
    )
  );
  const GenericValue = IDL.Variant({
    'Nat64Content' : IDL.Nat64,
    'Nat32Content' : IDL.Nat32,
    'BoolContent' : IDL.Bool,
    'Nat8Content' : IDL.Nat8,
    'Int64Content' : IDL.Int64,
    'IntContent' : IDL.Int,
    'NatContent' : IDL.Nat,
    'Nat16Content' : IDL.Nat16,
    'Int32Content' : IDL.Int32,
    'Int8Content' : IDL.Int8,
    'FloatContent' : IDL.Float64,
    'Int16Content' : IDL.Int16,
    'BlobContent' : IDL.Vec(IDL.Nat8),
    'NestedContent' : Vec,
    'Principal' : IDL.Principal,
    'TextContent' : IDL.Text,
  });
  const Result_2 = IDL.Variant({
    'Ok' : IDL.Opt(IDL.Principal),
    'Err' : NftError,
  });
  const ManualReply_1 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Nat),
    'Err' : NftError,
  });
  const TokenMetadata = IDL.Record({
    'transferred_at' : IDL.Opt(IDL.Nat64),
    'transferred_by' : IDL.Opt(IDL.Principal),
    'owner' : IDL.Opt(IDL.Principal),
    'operator' : IDL.Opt(IDL.Principal),
    'approved_at' : IDL.Opt(IDL.Nat64),
    'approved_by' : IDL.Opt(IDL.Principal),
    'properties' : IDL.Vec(IDL.Tuple(IDL.Text, GenericValue)),
    'is_burned' : IDL.Bool,
    'token_identifier' : IDL.Nat,
    'burned_at' : IDL.Opt(IDL.Nat64),
    'burned_by' : IDL.Opt(IDL.Principal),
    'minted_at' : IDL.Nat64,
    'minted_by' : IDL.Principal,
  });
  const ManualReply_2 = IDL.Variant({
    'Ok' : IDL.Vec(TokenMetadata),
    'Err' : NftError,
  });
  const Stats = IDL.Record({
    'cycles' : IDL.Nat,
    'total_transactions' : IDL.Nat,
    'total_unique_holders' : IDL.Nat,
    'total_supply' : IDL.Nat,
  });
  const SupportedInterface = IDL.Variant({
    'Burn' : IDL.Null,
    'Mint' : IDL.Null,
    'Approval' : IDL.Null,
  });
  const ManualReply_3 = IDL.Variant({ 'Ok' : TokenMetadata, 'Err' : NftError });
  return IDL.Service({
    'approve' : IDL.Func([IDL.Principal, IDL.Nat], [Result], []),
    'balanceOf' : IDL.Func([IDL.Principal], [Result], ['query']),
    'burn' : IDL.Func([IDL.Nat], [Result], []),
    'custodians' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'cycles' : IDL.Func([], [IDL.Nat], ['query']),
    'dfx_info' : IDL.Func([], [IDL.Text], ['query']),
    'dip721_approve' : IDL.Func([IDL.Principal, IDL.Nat], [Result], []),
    'dip721_balance_of' : IDL.Func([IDL.Principal], [Result], ['query']),
    'dip721_burn' : IDL.Func([IDL.Nat], [Result], []),
    'dip721_custodians' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'dip721_cycles' : IDL.Func([], [IDL.Nat], ['query']),
    'dip721_is_approved_for_all' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [Result_1],
        ['query'],
      ),
    'dip721_logo' : IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    'dip721_metadata' : IDL.Func([], [ManualReply], ['query']),
    'dip721_mint' : IDL.Func(
        [IDL.Principal, IDL.Nat, IDL.Vec(IDL.Tuple(IDL.Text, GenericValue))],
        [Result],
        [],
      ),
    'dip721_name' : IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    'dip721_operator_of' : IDL.Func([IDL.Nat], [Result_2], ['query']),
    'dip721_operator_token_identifiers' : IDL.Func(
        [IDL.Principal],
        [ManualReply_1],
        ['query'],
      ),
    'dip721_operator_token_metadata' : IDL.Func(
        [IDL.Principal],
        [ManualReply_2],
        ['query'],
      ),
    'dip721_owner_of' : IDL.Func([IDL.Nat], [Result_2], ['query']),
    'dip721_owner_token_identifiers' : IDL.Func(
        [IDL.Principal],
        [ManualReply_1],
        ['query'],
      ),
    'dip721_owner_token_metadata' : IDL.Func(
        [IDL.Principal],
        [ManualReply_2],
        ['query'],
      ),
    'dip721_set_approval_for_all' : IDL.Func(
        [IDL.Principal, IDL.Bool],
        [Result],
        [],
      ),
    'dip721_set_custodians' : IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    'dip721_set_logo' : IDL.Func([IDL.Text], [], []),
    'dip721_set_name' : IDL.Func([IDL.Text], [], []),
    'dip721_set_symbol' : IDL.Func([IDL.Text], [], []),
    'dip721_stats' : IDL.Func([], [Stats], ['query']),
    'dip721_supported_interfaces' : IDL.Func(
        [],
        [IDL.Vec(SupportedInterface)],
        ['query'],
      ),
    'dip721_symbol' : IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    'dip721_token_metadata' : IDL.Func([IDL.Nat], [ManualReply_3], ['query']),
    'dip721_total_supply' : IDL.Func([], [IDL.Nat], ['query']),
    'dip721_total_transactions' : IDL.Func([], [IDL.Nat], ['query']),
    'dip721_total_unique_holders' : IDL.Func([], [IDL.Nat], ['query']),
    'dip721_transfer' : IDL.Func([IDL.Principal, IDL.Nat], [Result], []),
    'dip721_transfer_from' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat],
        [Result],
        [],
      ),
    'git_commit_hash' : IDL.Func([], [IDL.Text], ['query']),
    'isApprovedForAll' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [Result_1],
        ['query'],
      ),
    'logo' : IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    'metadata' : IDL.Func([], [ManualReply], ['query']),
    'mint' : IDL.Func(
        [IDL.Principal, IDL.Nat, IDL.Vec(IDL.Tuple(IDL.Text, GenericValue))],
        [Result],
        [],
      ),
    'name' : IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    'operatorOf' : IDL.Func([IDL.Nat], [Result_2], ['query']),
    'operatorTokenIdentifiers' : IDL.Func(
        [IDL.Principal],
        [ManualReply_1],
        ['query'],
      ),
    'operatorTokenMetadata' : IDL.Func(
        [IDL.Principal],
        [ManualReply_2],
        ['query'],
      ),
    'ownerOf' : IDL.Func([IDL.Nat], [Result_2], ['query']),
    'ownerTokenIdentifiers' : IDL.Func(
        [IDL.Principal],
        [ManualReply_1],
        ['query'],
      ),
    'ownerTokenMetadata' : IDL.Func(
        [IDL.Principal],
        [ManualReply_2],
        ['query'],
      ),
    'rust_toolchain_info' : IDL.Func([], [IDL.Text], ['query']),
    'setApprovalForAll' : IDL.Func([IDL.Principal, IDL.Bool], [Result], []),
    'setCustodians' : IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    'setLogo' : IDL.Func([IDL.Text], [], []),
    'setName' : IDL.Func([IDL.Text], [], []),
    'setSymbol' : IDL.Func([IDL.Text], [], []),
    'stats' : IDL.Func([], [Stats], ['query']),
    'supportedInterfaces' : IDL.Func(
        [],
        [IDL.Vec(SupportedInterface)],
        ['query'],
      ),
    'symbol' : IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    'tokenMetadata' : IDL.Func([IDL.Nat], [ManualReply_3], ['query']),
    'totalSupply' : IDL.Func([], [IDL.Nat], ['query']),
    'totalTransactions' : IDL.Func([], [IDL.Nat], ['query']),
    'totalUniqueHolders' : IDL.Func([], [IDL.Nat], ['query']),
    'transfer' : IDL.Func([IDL.Principal, IDL.Nat], [Result], []),
    'transferFrom' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => {
  const InitArgs = IDL.Record({
    'cap' : IDL.Opt(IDL.Principal),
    'logo' : IDL.Opt(IDL.Text),
    'name' : IDL.Opt(IDL.Text),
    'custodians' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'symbol' : IDL.Opt(IDL.Text),
  });
  return [IDL.Opt(InitArgs)];
};
