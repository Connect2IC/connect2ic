import type { Principal } from '@dfinity/agent';
export type AllowanceActorResponse = { 'Ok' : bigint } |
  { 'Err' : CommonError };
export interface AllowanceRequest {
  'token' : string,
  'owner' : User,
  'spender' : Principal,
};
export interface ApproveRequest {
  'token' : string,
  'subaccount' : [] | [Array<number>],
  'allowance' : bigint,
  'spender' : Principal,
};
export interface BatchAddQuotaRequest { 'items' : Array<ImportQuotaItem> };
export interface BatchTransferRequest { 'items' : Array<TransferQuotaDetails> };
export type BearerActorResponse = { 'Ok' : string } |
  { 'Err' : CommonError };
export type BooleanActorResponse = { 'Ok' : boolean } |
  { 'Err' : ErrorInfo };
export interface CallbackStrategy {
  'token' : Token,
  'callback' : [Principal, string],
};
export type CommonError = { 'InvalidToken' : string } |
  { 'Other' : string };
export type EXTBatchTokensOfResponse = {
  'Ok' : Array<[Principal, Array<number>]>
} |
  { 'Err' : CommonError };
export type EXTTokensOfResponse = { 'Ok' : Array<number> } |
  { 'Err' : CommonError };
export type EXTTransferResponse = { 'Ok' : bigint } |
  { 'Err' : TransferError };
export interface ErrorInfo { 'code' : number, 'message' : string };
export interface Fungible {
  'decimals' : string,
  'metadata' : [] | [Array<number>],
  'name' : User,
  'symbol' : Principal,
};
export type GetAllDetailsActorResponse = { 'Ok' : Array<Registration> } |
  { 'Err' : ErrorInfo };
export type GetDetailsActorResponse = { 'Ok' : Registration } |
  { 'Err' : ErrorInfo };
export type GetNameExpiresActorResponse = { 'Ok' : bigint } |
  { 'Err' : ErrorInfo };
export type GetNameStatueActorResponse = { 'Ok' : NameStatus } |
  { 'Err' : ErrorInfo };
export type GetNamesActorResponse = { 'Ok' : GetPageOutput } |
  { 'Err' : ErrorInfo };
export type GetNamesCountActorResponse = { 'Ok' : number } |
  { 'Err' : ErrorInfo };
export type GetOwnerActorResponse = { 'Ok' : Principal } |
  { 'Err' : ErrorInfo };
export interface GetPageInput { 'offset' : bigint, 'limit' : bigint };
export interface GetPageOutput { 'items' : Array<RegistrationDto> };
export type GetPriceTableResponse = { 'Ok' : PriceTable } |
  { 'Err' : ErrorInfo };
export type GetPublicResolverActorResponse = { 'Ok' : string } |
  { 'Err' : ErrorInfo };
export type GetQuotaActorResponse = { 'Ok' : number } |
  { 'Err' : ErrorInfo };
export type GetStatsResponse = { 'Ok' : Stats } |
  { 'Err' : ErrorInfo };
export interface HttpRequest {
  'url' : string,
  'method' : string,
  'body' : Array<number>,
  'headers' : Array<[string, string]>,
};
export interface HttpResponse {
  'body' : Array<number>,
  'headers' : Array<[string, string]>,
  'streaming_strategy' : [] | [StreamingStrategy],
  'status_code' : number,
};
export interface ImportNameRegistrationItem {
  'owner' : Principal,
  'name' : string,
  'years' : number,
};
export interface ImportNameRegistrationRequest {
  'items' : Array<ImportNameRegistrationItem>,
};
export interface ImportQuotaItem {
  'owner' : Principal,
  'diff' : number,
  'quota_type' : string,
};
export interface ImportQuotaRequest {
  'hash' : Array<number>,
  'items' : Array<ImportQuotaItem>,
};
export type ImportQuotaResponse = { 'Ok' : ImportQuotaStatus } |
  { 'Err' : ErrorInfo };
export type ImportQuotaStatus = { 'Ok' : null } |
  { 'AlreadyExists' : null };
export type ImportTokenIdResponse = { 'Ok' : bigint } |
  { 'Err' : ErrorInfo };
export type Metadata = { 'fungible' : Fungible } |
  { 'nonfungible' : NonFungible };
export type MetadataActorResponse = { 'Ok' : Metadata } |
  { 'Err' : CommonError };
export interface NameStatus {
  'kept' : boolean,
  'available' : boolean,
  'details' : [] | [Registration],
  'registered' : boolean,
};
export interface NonFungible { 'metadata' : [] | [Array<number>] };
export interface PriceTable {
  'icp_xdr_conversion_rate' : bigint,
  'items' : Array<PriceTableItem>,
};
export interface PriceTableItem {
  'len' : number,
  'price_in_icp_e8s' : bigint,
  'price_in_xdr_permyriad' : bigint,
};
export type QuotaType = { 'LenEq' : number } |
  { 'LenGte' : number };
export interface RegisterNameWithPaymentRequest {
  'name' : string,
  'approve_amount' : bigint,
  'years' : number,
};
export interface Registration {
  'owner' : Principal,
  'name' : string,
  'created_at' : bigint,
  'expired_at' : bigint,
};
export interface RegistrationDto {
  'name' : string,
  'created_at' : bigint,
  'expired_at' : bigint,
};
export interface RenewNameRequest {
  'name' : string,
  'approve_amount' : bigint,
  'years' : number,
};
export interface StateExportData { 'state_data' : Array<number> };
export type StateExportResponse = { 'Ok' : StateExportData } |
  { 'Err' : ErrorInfo };
export interface Stats {
  'user_count' : bigint,
  'new_registered_name_count' : bigint,
  'cycles_balance' : bigint,
  'last_xdr_permyriad_per_icp' : bigint,
  'user_quota_count' : Array<[string, bigint]>,
  'name_order_paid_count' : bigint,
  'last_timestamp_seconds_xdr_permyriad_per_icp' : bigint,
  'name_lock_count' : bigint,
  'registration_count' : bigint,
};
export type StreamingStrategy = { 'Callback' : CallbackStrategy };
export type SupplyActorResponse = { 'Ok' : bigint } |
  { 'Err' : CommonError };
export interface Token {
  'key' : string,
  'sha256' : [] | [Array<number>],
  'index' : bigint,
  'content_encoding' : string,
};
export type TransferError = { 'CannotNotify' : string } |
  { 'InsufficientBalance' : null } |
  { 'InvalidToken' : string } |
  { 'Rejected' : null } |
  { 'Unauthorized' : string } |
  { 'Other' : string };
export interface TransferFromQuotaRequest {
  'to' : Principal,
  'diff' : number,
  'from' : Principal,
  'quota_type' : QuotaType,
};
export interface TransferQuotaDetails {
  'to' : Principal,
  'diff' : number,
  'quota_type' : QuotaType,
};
export interface TransferRequest {
  'to' : User,
  'token' : string,
  'notify' : boolean,
  'from' : User,
  'memo' : Array<number>,
  'subaccount' : [] | [Array<number>],
  'amount' : bigint,
};
export type User = { 'principal' : Principal } |
  { 'address' : string };
export default interface _SERVICE {
  'add_quota' : (arg_0: Principal, arg_1: QuotaType, arg_2: number) => Promise<
    BooleanActorResponse
  >,
  'allowance' : (arg_0: AllowanceRequest) => Promise<AllowanceActorResponse>,
  'approve' : (arg_0: string, arg_1: Principal) => Promise<
    BooleanActorResponse
  >,
  'available' : (arg_0: string) => Promise<BooleanActorResponse>,
  'batch_add_quota' : (arg_0: BatchAddQuotaRequest) => Promise<
    BooleanActorResponse
  >,
  'batch_transfer_quota' : (arg_0: BatchTransferRequest) => Promise<
    BooleanActorResponse
  >,
  'bearer' : (arg_0: string) => Promise<BearerActorResponse>,
  'export_state' : () => Promise<StateExportResponse>,
  'ext_approve' : (arg_0: ApproveRequest) => Promise<boolean>,
  'ext_batch_tokens_of' : (arg_0: Array<Principal>) => Promise<
    EXTBatchTokensOfResponse
  >,
  'ext_tokens_of' : (arg_0: Principal) => Promise<EXTTokensOfResponse>,
  'ext_transfer' : (arg_0: TransferRequest) => Promise<EXTTransferResponse>,
  'getMinter' : () => Promise<Principal>,
  'getRegistry' : () => Promise<Array<[number, string]>>,
  'getTokens' : () => Promise<Array<[number, Metadata]>>,
  'get_all_details' : (arg_0: GetPageInput) => Promise<
    GetAllDetailsActorResponse
  >,
  'get_details' : (arg_0: string) => Promise<GetDetailsActorResponse>,
  'get_last_registrations' : () => Promise<GetAllDetailsActorResponse>,
  'get_name_expires' : (arg_0: string) => Promise<GetNameExpiresActorResponse>,
  'get_name_status' : (arg_0: string) => Promise<GetNameStatueActorResponse>,
  'get_names' : (arg_0: Principal, arg_1: GetPageInput) => Promise<
    GetNamesActorResponse
  >,
  'get_names_count' : (arg_0: Principal) => Promise<GetNamesCountActorResponse>,
  'get_owner' : (arg_0: string) => Promise<GetOwnerActorResponse>,
  'get_price_table' : () => Promise<GetPriceTableResponse>,
  'get_public_resolver' : () => Promise<GetPublicResolverActorResponse>,
  'get_quota' : (arg_0: Principal, arg_1: QuotaType) => Promise<
    GetQuotaActorResponse
  >,
  'get_stats' : () => Promise<GetStatsResponse>,
  'get_token_details_by_names' : (arg_0: Array<string>) => Promise<
    Array<[string, [] | [[number, string]]]>
  >,
  'get_wasm_info' : () => Promise<Array<[string, string]>>,
  'http_request' : (arg_0: HttpRequest) => Promise<HttpResponse>,
  'import_quota' : (arg_0: ImportQuotaRequest) => Promise<ImportQuotaResponse>,
  'import_registrations' : (arg_0: ImportNameRegistrationRequest) => Promise<
    BooleanActorResponse
  >,
  'import_token_id_from_registration' : () => Promise<ImportTokenIdResponse>,
  'load_state' : (arg_0: StateExportData) => Promise<BooleanActorResponse>,
  'metadata' : (arg_0: string) => Promise<MetadataActorResponse>,
  'reclaim_name' : (arg_0: string) => Promise<BooleanActorResponse>,
  'register_for' : (arg_0: string, arg_1: Principal, arg_2: bigint) => Promise<
    BooleanActorResponse
  >,
  'register_from_gateway' : (arg_0: string, arg_1: Principal) => Promise<
    BooleanActorResponse
  >,
  'register_with_payment' : (arg_0: RegisterNameWithPaymentRequest) => Promise<
    GetDetailsActorResponse
  >,
  'register_with_quota' : (arg_0: string, arg_1: QuotaType) => Promise<
    BooleanActorResponse
  >,
  'renew_name' : (arg_0: RenewNameRequest) => Promise<BooleanActorResponse>,
  'run_tasks' : () => Promise<BooleanActorResponse>,
  'sub_quota' : (arg_0: Principal, arg_1: QuotaType, arg_2: number) => Promise<
    BooleanActorResponse
  >,
  'supply' : () => Promise<SupplyActorResponse>,
  'transfer' : (arg_0: string, arg_1: Principal) => Promise<
    BooleanActorResponse
  >,
  'transfer_by_admin' : (arg_0: string, arg_1: Principal) => Promise<
    BooleanActorResponse
  >,
  'transfer_from' : (arg_0: string) => Promise<BooleanActorResponse>,
  'transfer_from_quota' : (arg_0: TransferFromQuotaRequest) => Promise<
    BooleanActorResponse
  >,
  'transfer_quota' : (
    arg_0: Principal,
    arg_1: QuotaType,
    arg_2: number,
  ) => Promise<BooleanActorResponse>,
  'unlock_names' : (arg_0: Array<string>) => Promise<BooleanActorResponse>,
};
