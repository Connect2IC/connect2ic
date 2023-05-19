export const idlFactory = ({ IDL }) => {
  const QuotaType = IDL.Variant({ 'LenEq' : IDL.Nat8, 'LenGte' : IDL.Nat8 });
  const ErrorInfo = IDL.Record({ 'code' : IDL.Nat32, 'message' : IDL.Text });
  const BooleanActorResponse = IDL.Variant({
    'Ok' : IDL.Bool,
    'Err' : ErrorInfo,
  });
  const User = IDL.Variant({
    'principal' : IDL.Principal,
    'address' : IDL.Text,
  });
  const AllowanceRequest = IDL.Record({
    'token' : IDL.Text,
    'owner' : User,
    'spender' : IDL.Principal,
  });
  const CommonError = IDL.Variant({
    'InvalidToken' : IDL.Text,
    'Other' : IDL.Text,
  });
  const AllowanceActorResponse = IDL.Variant({
    'Ok' : IDL.Nat,
    'Err' : CommonError,
  });
  const ImportQuotaItem = IDL.Record({
    'owner' : IDL.Principal,
    'diff' : IDL.Nat32,
    'quota_type' : IDL.Text,
  });
  const BatchAddQuotaRequest = IDL.Record({
    'items' : IDL.Vec(ImportQuotaItem),
  });
  const TransferQuotaDetails = IDL.Record({
    'to' : IDL.Principal,
    'diff' : IDL.Nat32,
    'quota_type' : QuotaType,
  });
  const BatchTransferRequest = IDL.Record({
    'items' : IDL.Vec(TransferQuotaDetails),
  });
  const BearerActorResponse = IDL.Variant({
    'Ok' : IDL.Text,
    'Err' : CommonError,
  });
  const StateExportData = IDL.Record({ 'state_data' : IDL.Vec(IDL.Nat8) });
  const StateExportResponse = IDL.Variant({
    'Ok' : StateExportData,
    'Err' : ErrorInfo,
  });
  const ApproveRequest = IDL.Record({
    'token' : IDL.Text,
    'subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'allowance' : IDL.Nat,
    'spender' : IDL.Principal,
  });
  const EXTBatchTokensOfResponse = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(IDL.Nat32))),
    'Err' : CommonError,
  });
  const EXTTokensOfResponse = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Nat32),
    'Err' : CommonError,
  });
  const TransferRequest = IDL.Record({
    'to' : User,
    'token' : IDL.Text,
    'notify' : IDL.Bool,
    'from' : User,
    'memo' : IDL.Vec(IDL.Nat8),
    'subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'amount' : IDL.Nat,
  });
  const TransferError = IDL.Variant({
    'CannotNotify' : IDL.Text,
    'InsufficientBalance' : IDL.Null,
    'InvalidToken' : IDL.Text,
    'Rejected' : IDL.Null,
    'Unauthorized' : IDL.Text,
    'Other' : IDL.Text,
  });
  const EXTTransferResponse = IDL.Variant({
    'Ok' : IDL.Nat,
    'Err' : TransferError,
  });
  const Fungible = IDL.Record({
    'decimals' : IDL.Text,
    'metadata' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'name' : User,
    'symbol' : IDL.Principal,
  });
  const NonFungible = IDL.Record({ 'metadata' : IDL.Opt(IDL.Vec(IDL.Nat8)) });
  const Metadata = IDL.Variant({
    'fungible' : Fungible,
    'nonfungible' : NonFungible,
  });
  const GetPageInput = IDL.Record({
    'offset' : IDL.Nat64,
    'limit' : IDL.Nat64,
  });
  const Registration = IDL.Record({
    'owner' : IDL.Principal,
    'name' : IDL.Text,
    'created_at' : IDL.Nat64,
    'expired_at' : IDL.Nat64,
  });
  const GetAllDetailsActorResponse = IDL.Variant({
    'Ok' : IDL.Vec(Registration),
    'Err' : ErrorInfo,
  });
  const GetDetailsActorResponse = IDL.Variant({
    'Ok' : Registration,
    'Err' : ErrorInfo,
  });
  const GetNameExpiresActorResponse = IDL.Variant({
    'Ok' : IDL.Nat64,
    'Err' : ErrorInfo,
  });
  const NameStatus = IDL.Record({
    'kept' : IDL.Bool,
    'available' : IDL.Bool,
    'details' : IDL.Opt(Registration),
    'registered' : IDL.Bool,
  });
  const GetNameStatueActorResponse = IDL.Variant({
    'Ok' : NameStatus,
    'Err' : ErrorInfo,
  });
  const RegistrationDto = IDL.Record({
    'name' : IDL.Text,
    'created_at' : IDL.Nat64,
    'expired_at' : IDL.Nat64,
  });
  const GetPageOutput = IDL.Record({ 'items' : IDL.Vec(RegistrationDto) });
  const GetNamesActorResponse = IDL.Variant({
    'Ok' : GetPageOutput,
    'Err' : ErrorInfo,
  });
  const GetNamesCountActorResponse = IDL.Variant({
    'Ok' : IDL.Nat32,
    'Err' : ErrorInfo,
  });
  const GetOwnerActorResponse = IDL.Variant({
    'Ok' : IDL.Principal,
    'Err' : ErrorInfo,
  });
  const PriceTableItem = IDL.Record({
    'len' : IDL.Nat8,
    'price_in_icp_e8s' : IDL.Nat64,
    'price_in_xdr_permyriad' : IDL.Nat64,
  });
  const PriceTable = IDL.Record({
    'icp_xdr_conversion_rate' : IDL.Nat64,
    'items' : IDL.Vec(PriceTableItem),
  });
  const GetPriceTableResponse = IDL.Variant({
    'Ok' : PriceTable,
    'Err' : ErrorInfo,
  });
  const GetPublicResolverActorResponse = IDL.Variant({
    'Ok' : IDL.Text,
    'Err' : ErrorInfo,
  });
  const GetQuotaActorResponse = IDL.Variant({
    'Ok' : IDL.Nat32,
    'Err' : ErrorInfo,
  });
  const Stats = IDL.Record({
    'user_count' : IDL.Nat64,
    'new_registered_name_count' : IDL.Nat64,
    'cycles_balance' : IDL.Nat64,
    'last_xdr_permyriad_per_icp' : IDL.Nat64,
    'user_quota_count' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat64)),
    'name_order_paid_count' : IDL.Nat64,
    'last_timestamp_seconds_xdr_permyriad_per_icp' : IDL.Nat64,
    'name_lock_count' : IDL.Nat64,
    'registration_count' : IDL.Nat64,
  });
  const GetStatsResponse = IDL.Variant({ 'Ok' : Stats, 'Err' : ErrorInfo });
  const HttpRequest = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  });
  const Token = IDL.Record({
    'key' : IDL.Text,
    'sha256' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'index' : IDL.Nat,
    'content_encoding' : IDL.Text,
  });
  const CallbackStrategy = IDL.Record({
    'token' : Token,
    'callback' : IDL.Func([], [], []),
  });
  const StreamingStrategy = IDL.Variant({ 'Callback' : CallbackStrategy });
  const HttpResponse = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'streaming_strategy' : IDL.Opt(StreamingStrategy),
    'status_code' : IDL.Nat16,
  });
  const ImportQuotaRequest = IDL.Record({
    'hash' : IDL.Vec(IDL.Nat8),
    'items' : IDL.Vec(ImportQuotaItem),
  });
  const ImportQuotaStatus = IDL.Variant({
    'Ok' : IDL.Null,
    'AlreadyExists' : IDL.Null,
  });
  const ImportQuotaResponse = IDL.Variant({
    'Ok' : ImportQuotaStatus,
    'Err' : ErrorInfo,
  });
  const ImportNameRegistrationItem = IDL.Record({
    'owner' : IDL.Principal,
    'name' : IDL.Text,
    'years' : IDL.Nat32,
  });
  const ImportNameRegistrationRequest = IDL.Record({
    'items' : IDL.Vec(ImportNameRegistrationItem),
  });
  const ImportTokenIdResponse = IDL.Variant({
    'Ok' : IDL.Nat64,
    'Err' : ErrorInfo,
  });
  const MetadataActorResponse = IDL.Variant({
    'Ok' : Metadata,
    'Err' : CommonError,
  });
  const RegisterNameWithPaymentRequest = IDL.Record({
    'name' : IDL.Text,
    'approve_amount' : IDL.Nat,
    'years' : IDL.Nat32,
  });
  const RenewNameRequest = IDL.Record({
    'name' : IDL.Text,
    'approve_amount' : IDL.Nat64,
    'years' : IDL.Nat32,
  });
  const SupplyActorResponse = IDL.Variant({
    'Ok' : IDL.Nat,
    'Err' : CommonError,
  });
  const TransferFromQuotaRequest = IDL.Record({
    'to' : IDL.Principal,
    'diff' : IDL.Nat32,
    'from' : IDL.Principal,
    'quota_type' : QuotaType,
  });
  return IDL.Service({
    'add_quota' : IDL.Func(
      [IDL.Principal, QuotaType, IDL.Nat32],
      [BooleanActorResponse],
      [],
    ),
    'allowance' : IDL.Func(
      [AllowanceRequest],
      [AllowanceActorResponse],
      ['query'],
    ),
    'approve' : IDL.Func([IDL.Text, IDL.Principal], [BooleanActorResponse], []),
    'available' : IDL.Func([IDL.Text], [BooleanActorResponse], ['query']),
    'batch_add_quota' : IDL.Func(
      [BatchAddQuotaRequest],
      [BooleanActorResponse],
      [],
    ),
    'batch_transfer_quota' : IDL.Func(
      [BatchTransferRequest],
      [BooleanActorResponse],
      [],
    ),
    'bearer' : IDL.Func([IDL.Text], [BearerActorResponse], ['query']),
    'export_state' : IDL.Func([], [StateExportResponse], []),
    'ext_approve' : IDL.Func([ApproveRequest], [IDL.Bool], []),
    'ext_batch_tokens_of' : IDL.Func(
      [IDL.Vec(IDL.Principal)],
      [EXTBatchTokensOfResponse],
      ['query'],
    ),
    'ext_tokens_of' : IDL.Func(
      [IDL.Principal],
      [EXTTokensOfResponse],
      ['query'],
    ),
    'ext_transfer' : IDL.Func([TransferRequest], [EXTTransferResponse], []),
    'getMinter' : IDL.Func([], [IDL.Principal], ['query']),
    'getRegistry' : IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Nat32, IDL.Text))],
      ['query'],
    ),
    'getTokens' : IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Nat32, Metadata))],
      ['query'],
    ),
    'get_all_details' : IDL.Func(
      [GetPageInput],
      [GetAllDetailsActorResponse],
      ['query'],
    ),
    'get_details' : IDL.Func([IDL.Text], [GetDetailsActorResponse], ['query']),
    'get_last_registrations' : IDL.Func(
      [],
      [GetAllDetailsActorResponse],
      ['query'],
    ),
    'get_name_expires' : IDL.Func(
      [IDL.Text],
      [GetNameExpiresActorResponse],
      ['query'],
    ),
    'get_name_status' : IDL.Func(
      [IDL.Text],
      [GetNameStatueActorResponse],
      ['query'],
    ),
    'get_names' : IDL.Func(
      [IDL.Principal, GetPageInput],
      [GetNamesActorResponse],
      ['query'],
    ),
    'get_names_count' : IDL.Func(
      [IDL.Principal],
      [GetNamesCountActorResponse],
      ['query'],
    ),
    'get_owner' : IDL.Func([IDL.Text], [GetOwnerActorResponse], ['query']),
    'get_price_table' : IDL.Func([], [GetPriceTableResponse], []),
    'get_public_resolver' : IDL.Func(
      [],
      [GetPublicResolverActorResponse],
      ['query'],
    ),
    'get_quota' : IDL.Func(
      [IDL.Principal, QuotaType],
      [GetQuotaActorResponse],
      ['query'],
    ),
    'get_stats' : IDL.Func([], [GetStatsResponse], ['query']),
    'get_token_details_by_names' : IDL.Func(
      [IDL.Vec(IDL.Text)],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Opt(IDL.Tuple(IDL.Nat32, IDL.Text))))],
      ['query'],
    ),
    'get_wasm_info' : IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
      ['query'],
    ),
    'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
    'import_quota' : IDL.Func([ImportQuotaRequest], [ImportQuotaResponse], []),
    'import_registrations' : IDL.Func(
      [ImportNameRegistrationRequest],
      [BooleanActorResponse],
      [],
    ),
    'import_token_id_from_registration' : IDL.Func(
      [],
      [ImportTokenIdResponse],
      [],
    ),
    'load_state' : IDL.Func([StateExportData], [BooleanActorResponse], []),
    'metadata' : IDL.Func([IDL.Text], [MetadataActorResponse], ['query']),
    'reclaim_name' : IDL.Func([IDL.Text], [BooleanActorResponse], []),
    'register_for' : IDL.Func(
      [IDL.Text, IDL.Principal, IDL.Nat64],
      [BooleanActorResponse],
      [],
    ),
    'register_from_gateway' : IDL.Func(
      [IDL.Text, IDL.Principal],
      [BooleanActorResponse],
      [],
    ),
    'register_with_payment' : IDL.Func(
      [RegisterNameWithPaymentRequest],
      [GetDetailsActorResponse],
      [],
    ),
    'register_with_quota' : IDL.Func(
      [IDL.Text, QuotaType],
      [BooleanActorResponse],
      [],
    ),
    'renew_name' : IDL.Func([RenewNameRequest], [BooleanActorResponse], []),
    'run_tasks' : IDL.Func([], [BooleanActorResponse], []),
    'sub_quota' : IDL.Func(
      [IDL.Principal, QuotaType, IDL.Nat32],
      [BooleanActorResponse],
      [],
    ),
    'supply' : IDL.Func([], [SupplyActorResponse], ['query']),
    'transfer' : IDL.Func(
      [IDL.Text, IDL.Principal],
      [BooleanActorResponse],
      [],
    ),
    'transfer_by_admin' : IDL.Func(
      [IDL.Text, IDL.Principal],
      [BooleanActorResponse],
      [],
    ),
    'transfer_from' : IDL.Func([IDL.Text], [BooleanActorResponse], []),
    'transfer_from_quota' : IDL.Func(
      [TransferFromQuotaRequest],
      [BooleanActorResponse],
      [],
    ),
    'transfer_quota' : IDL.Func(
      [IDL.Principal, QuotaType, IDL.Nat32],
      [BooleanActorResponse],
      [],
    ),
    'unlock_names' : IDL.Func([IDL.Vec(IDL.Text)], [BooleanActorResponse], []),
  });
};
export const init = ({ IDL }) => { return []; };
