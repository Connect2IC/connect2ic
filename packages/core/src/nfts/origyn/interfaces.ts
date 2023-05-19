import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Account = { 'account_id' : string } |
  { 'principal' : Principal } |
  { 'extensible' : CandyValue } |
  { 'account' : { 'owner' : Principal, 'sub_account' : [] | [Uint8Array] } };
export type AccountIdentifier = string;
export type Account__1 = { 'account_id' : string } |
  { 'principal' : Principal } |
  { 'extensible' : CandyValue } |
  { 'account' : { 'owner' : Principal, 'sub_account' : [] | [Uint8Array] } };
export interface AllocationRecordStable {
  'allocated_space' : bigint,
  'token_id' : string,
  'available_space' : bigint,
  'canister' : Principal,
  'chunks' : Array<bigint>,
  'library_id' : string,
}
export interface AuctionConfig {
  'start_price' : bigint,
  'token' : TokenSpec,
  'reserve' : [] | [bigint],
  'start_date' : bigint,
  'min_increase' : { 'amount' : bigint } |
    { 'percentage' : number },
  'allow_list' : [] | [Array<Principal>],
  'buy_now' : [] | [bigint],
  'ending' : {
      'waitForQuiet' : {
        'max' : bigint,
        'date' : bigint,
        'fade' : number,
        'extention' : bigint,
      }
    } |
    { 'date' : bigint },
}
export interface AuctionStateStable {
  'status' : { 'closed' : null } |
    { 'open' : null } |
    { 'not_started' : null },
  'participants' : Array<[Principal, bigint]>,
  'current_bid_amount' : bigint,
  'winner' : [] | [Account],
  'end_date' : bigint,
  'wait_for_quiet_count' : [] | [bigint],
  'current_escrow' : [] | [EscrowReceipt],
  'allow_list' : [] | [Array<[Principal, boolean]>],
  'current_broker_id' : [] | [Principal],
  'min_next_bid' : bigint,
  'config' : PricingConfig__1,
}
export type Balance = bigint;
export interface BalanceRequest { 'token' : TokenIdentifier, 'user' : User }
export interface BalanceResponse {
  'nfts' : Array<string>,
  'offers' : Array<EscrowRecord>,
  'sales' : Array<EscrowRecord>,
  'stake' : Array<StakeRecord>,
  'multi_canister' : [] | [Array<Principal>],
  'escrow' : Array<EscrowRecord>,
}
export type BalanceResponse__1 = { 'ok' : Balance } |
  { 'err' : CommonError };
export interface BidRequest {
  'broker_id' : [] | [Principal],
  'escrow_receipt' : EscrowReceipt,
  'sale_id' : string,
}
export interface BidResponse {
  'token_id' : string,
  'txn_type' : {
      'escrow_deposit' : {
        'token' : TokenSpec,
        'token_id' : string,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
      }
    } |
    {
      'canister_network_updated' : {
        'network' : Principal,
        'extensible' : CandyValue,
      }
    } |
    {
      'escrow_withdraw' : {
        'fee' : bigint,
        'token' : TokenSpec,
        'token_id' : string,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
      }
    } |
    {
      'canister_managers_updated' : {
        'managers' : Array<Principal>,
        'extensible' : CandyValue,
      }
    } |
    {
      'auction_bid' : {
        'token' : TokenSpec,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
        'sale_id' : string,
      }
    } |
    { 'burn' : null } |
    { 'data' : null } |
    {
      'sale_ended' : {
        'token' : TokenSpec,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
        'sale_id' : [] | [string],
      }
    } |
    {
      'mint' : {
        'to' : Account__1,
        'from' : Account__1,
        'sale' : [] | [{ 'token' : TokenSpec, 'amount' : bigint }],
        'extensible' : CandyValue,
      }
    } |
    {
      'royalty_paid' : {
        'tag' : string,
        'token' : TokenSpec,
        'reciever' : Account__1,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
        'sale_id' : [] | [string],
      }
    } |
    { 'extensible' : CandyValue } |
    {
      'owner_transfer' : {
        'to' : Account__1,
        'from' : Account__1,
        'extensible' : CandyValue,
      }
    } |
    {
      'sale_opened' : {
        'pricing' : PricingConfig,
        'extensible' : CandyValue,
        'sale_id' : string,
      }
    } |
    {
      'canister_owner_updated' : {
        'owner' : Principal,
        'extensible' : CandyValue,
      }
    } |
    {
      'sale_withdraw' : {
        'fee' : bigint,
        'token' : TokenSpec,
        'token_id' : string,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
      }
    } |
    {
      'deposit_withdraw' : {
        'fee' : bigint,
        'token' : TokenSpec,
        'trx_id' : TransactionID,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
      }
    },
  'timestamp' : bigint,
  'index' : bigint,
}
export type Caller = [] | [Principal];
export type CandyValue = { 'Int' : bigint } |
  { 'Nat' : bigint } |
  { 'Empty' : null } |
  { 'Nat16' : number } |
  { 'Nat32' : number } |
  { 'Nat64' : bigint } |
  { 'Blob' : Uint8Array } |
  { 'Bool' : boolean } |
  { 'Int8' : number } |
  { 'Nat8' : number } |
  { 'Nats' : { 'thawed' : Array<bigint> } | { 'frozen' : Array<bigint> } } |
  { 'Text' : string } |
  { 'Bytes' : { 'thawed' : Uint8Array } | { 'frozen' : Uint8Array } } |
  { 'Int16' : number } |
  { 'Int32' : number } |
  { 'Int64' : bigint } |
  { 'Option' : [] | [CandyValue] } |
  { 'Floats' : { 'thawed' : Array<number> } | { 'frozen' : Array<number> } } |
  { 'Float' : number } |
  { 'Principal' : Principal } |
  {
    'Array' : { 'thawed' : Array<CandyValue> } |
      { 'frozen' : Array<CandyValue> }
  } |
  { 'Class' : Array<Property> };
export type CanisterCyclesAggregatedData = BigUint64Array;
export type CanisterHeapMemoryAggregatedData = BigUint64Array;
export type CanisterLogFeature = { 'filterMessageByContains' : null } |
  { 'filterMessageByRegex' : null };
export interface CanisterLogMessages {
  'data' : Array<LogMessagesData>,
  'lastAnalyzedMessageTimeNanos' : [] | [Nanos],
}
export interface CanisterLogMessagesInfo {
  'features' : Array<[] | [CanisterLogFeature]>,
  'lastTimeNanos' : [] | [Nanos],
  'count' : number,
  'firstTimeNanos' : [] | [Nanos],
}
export type CanisterLogRequest = { 'getMessagesInfo' : null } |
  { 'getMessages' : GetLogMessagesParameters } |
  { 'getLatestMessages' : GetLatestLogMessagesParameters };
export type CanisterLogResponse = { 'messagesInfo' : CanisterLogMessagesInfo } |
  { 'messages' : CanisterLogMessages };
export type CanisterMemoryAggregatedData = BigUint64Array;
export interface CanisterMetrics { 'data' : CanisterMetricsData }
export type CanisterMetricsData = { 'hourly' : Array<HourlyMetricsData> } |
  { 'daily' : Array<DailyMetricsData> };
export type ChunkContent = {
    'remote' : { 'args' : ChunkRequest, 'canister' : Principal }
  } |
  {
    'chunk' : {
      'total_chunks' : bigint,
      'content' : Uint8Array,
      'storage_allocation' : AllocationRecordStable,
      'current_chunk' : [] | [bigint],
    }
  };
export interface ChunkRequest {
  'token_id' : string,
  'chunk' : [] | [bigint],
  'library_id' : string,
}
export interface CollectionInfo {
  'multi_canister_count' : [] | [bigint],
  'managers' : [] | [Array<Principal>],
  'owner' : [] | [Principal],
  'metadata' : [] | [CandyValue],
  'logo' : [] | [string],
  'name' : [] | [string],
  'network' : [] | [Principal],
  'fields' : [] | [Array<[string, [] | [bigint], [] | [bigint]]>],
  'token_ids_count' : [] | [bigint],
  'available_space' : [] | [bigint],
  'multi_canister' : [] | [Array<Principal>],
  'token_ids' : [] | [Array<string>],
  'total_supply' : [] | [bigint],
  'symbol' : [] | [string],
  'allocated_storage' : [] | [bigint],
}
export type CommonError = { 'InvalidToken' : TokenIdentifier } |
  { 'Other' : string };
export interface DailyMetricsData {
  'updateCalls' : bigint,
  'canisterHeapMemorySize' : NumericEntity,
  'canisterCycles' : NumericEntity,
  'canisterMemorySize' : NumericEntity,
  'timeMillis' : bigint,
}
export type Data = { 'Int' : bigint } |
  { 'Nat' : bigint } |
  { 'Empty' : null } |
  { 'Nat16' : number } |
  { 'Nat32' : number } |
  { 'Nat64' : bigint } |
  { 'Blob' : Uint8Array } |
  { 'Bool' : boolean } |
  { 'Int8' : number } |
  { 'Nat8' : number } |
  { 'Nats' : { 'thawed' : Array<bigint> } | { 'frozen' : Array<bigint> } } |
  { 'Text' : string } |
  { 'Bytes' : { 'thawed' : Uint8Array } | { 'frozen' : Uint8Array } } |
  { 'Int16' : number } |
  { 'Int32' : number } |
  { 'Int64' : bigint } |
  { 'Option' : [] | [CandyValue] } |
  { 'Floats' : { 'thawed' : Array<number> } | { 'frozen' : Array<number> } } |
  { 'Float' : number } |
  { 'Principal' : Principal } |
  {
    'Array' : { 'thawed' : Array<CandyValue> } |
      { 'frozen' : Array<CandyValue> }
  } |
  { 'Class' : Array<Property> };
export interface DepositDetail {
  'token' : TokenSpec__1,
  'trx_id' : [] | [TransactionID__1],
  'seller' : Account,
  'buyer' : Account,
  'amount' : bigint,
  'sale_id' : [] | [string],
}
export interface DepositWithdrawDescription {
  'token' : TokenSpec__1,
  'withdraw_to' : Account,
  'buyer' : Account,
  'amount' : bigint,
}
export interface DistributeSaleRequest { 'seller' : [] | [Account] }
export type DistributeSaleResponse = Array<Result_6>;
export type EXTTokensResult = [
  number,
  [] | [{ 'locked' : [] | [bigint], 'seller' : Principal, 'price' : bigint }],
  [] | [Uint8Array],
];
export interface EndSaleResponse {
  'token_id' : string,
  'txn_type' : {
      'escrow_deposit' : {
        'token' : TokenSpec,
        'token_id' : string,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
      }
    } |
    {
      'canister_network_updated' : {
        'network' : Principal,
        'extensible' : CandyValue,
      }
    } |
    {
      'escrow_withdraw' : {
        'fee' : bigint,
        'token' : TokenSpec,
        'token_id' : string,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
      }
    } |
    {
      'canister_managers_updated' : {
        'managers' : Array<Principal>,
        'extensible' : CandyValue,
      }
    } |
    {
      'auction_bid' : {
        'token' : TokenSpec,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
        'sale_id' : string,
      }
    } |
    { 'burn' : null } |
    { 'data' : null } |
    {
      'sale_ended' : {
        'token' : TokenSpec,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
        'sale_id' : [] | [string],
      }
    } |
    {
      'mint' : {
        'to' : Account__1,
        'from' : Account__1,
        'sale' : [] | [{ 'token' : TokenSpec, 'amount' : bigint }],
        'extensible' : CandyValue,
      }
    } |
    {
      'royalty_paid' : {
        'tag' : string,
        'token' : TokenSpec,
        'reciever' : Account__1,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
        'sale_id' : [] | [string],
      }
    } |
    { 'extensible' : CandyValue } |
    {
      'owner_transfer' : {
        'to' : Account__1,
        'from' : Account__1,
        'extensible' : CandyValue,
      }
    } |
    {
      'sale_opened' : {
        'pricing' : PricingConfig,
        'extensible' : CandyValue,
        'sale_id' : string,
      }
    } |
    {
      'canister_owner_updated' : {
        'owner' : Principal,
        'extensible' : CandyValue,
      }
    } |
    {
      'sale_withdraw' : {
        'fee' : bigint,
        'token' : TokenSpec,
        'token_id' : string,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
      }
    } |
    {
      'deposit_withdraw' : {
        'fee' : bigint,
        'token' : TokenSpec,
        'trx_id' : TransactionID,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
      }
    },
  'timestamp' : bigint,
  'index' : bigint,
}
export type Errors = { 'nyi' : null } |
  { 'storage_configuration_error' : null } |
  { 'escrow_withdraw_payment_failed' : null } |
  { 'token_not_found' : null } |
  { 'owner_not_found' : null } |
  { 'content_not_found' : null } |
  { 'auction_ended' : null } |
  { 'out_of_range' : null } |
  { 'sale_id_does_not_match' : null } |
  { 'sale_not_found' : null } |
  { 'item_not_owned' : null } |
  { 'property_not_found' : null } |
  { 'validate_trx_wrong_host' : null } |
  { 'withdraw_too_large' : null } |
  { 'content_not_deserializable' : null } |
  { 'bid_too_low' : null } |
  { 'validate_deposit_wrong_amount' : null } |
  { 'existing_sale_found' : null } |
  { 'asset_mismatch' : null } |
  { 'escrow_cannot_be_removed' : null } |
  { 'deposit_burned' : null } |
  { 'cannot_restage_minted_token' : null } |
  { 'cannot_find_status_in_metadata' : null } |
  { 'receipt_data_mismatch' : null } |
  { 'validate_deposit_failed' : null } |
  { 'unreachable' : null } |
  { 'unauthorized_access' : null } |
  { 'item_already_minted' : null } |
  { 'no_escrow_found' : null } |
  { 'escrow_owner_not_the_owner' : null } |
  { 'improper_interface' : null } |
  { 'app_id_not_found' : null } |
  { 'token_non_transferable' : null } |
  { 'sale_not_over' : null } |
  { 'update_class_error' : null } |
  { 'malformed_metadata' : null } |
  { 'token_id_mismatch' : null } |
  { 'id_not_found_in_metadata' : null } |
  { 'auction_not_started' : null } |
  { 'library_not_found' : null } |
  { 'attempt_to_stage_system_data' : null } |
  { 'validate_deposit_wrong_buyer' : null } |
  { 'not_enough_storage' : null } |
  { 'sales_withdraw_payment_failed' : null };
export interface EscrowReceipt {
  'token' : TokenSpec,
  'token_id' : string,
  'seller' : Account__1,
  'buyer' : Account__1,
  'amount' : bigint,
}
export interface EscrowRecord {
  'token' : TokenSpec,
  'token_id' : string,
  'seller' : Account__1,
  'lock_to_date' : [] | [bigint],
  'buyer' : Account__1,
  'amount' : bigint,
  'sale_id' : [] | [string],
  'account_hash' : [] | [Uint8Array],
}
export interface EscrowRequest {
  'token_id' : string,
  'deposit' : DepositDetail,
  'lock_to_date' : [] | [bigint],
}
export interface EscrowResponse {
  'balance' : bigint,
  'receipt' : EscrowReceipt,
  'transaction' : TransactionRecord,
}
export interface GetLatestLogMessagesParameters {
  'upToTimeNanos' : [] | [Nanos],
  'count' : number,
  'filter' : [] | [GetLogMessagesFilter],
}
export interface GetLogMessagesFilter {
  'analyzeCount' : number,
  'messageRegex' : [] | [string],
  'messageContains' : [] | [string],
}
export interface GetLogMessagesParameters {
  'count' : number,
  'filter' : [] | [GetLogMessagesFilter],
  'fromTimeNanos' : [] | [Nanos],
}
export interface GetMetricsParameters {
  'dateToMillis' : bigint,
  'granularity' : MetricsGranularity,
  'dateFromMillis' : bigint,
}
export type GovernanceRequest = { 'clear_shared_wallets' : string };
export type GovernanceResponse = { 'clear_shared_wallets' : boolean };
export interface HTTPResponse {
  'body' : Uint8Array,
  'headers' : Array<HeaderField__1>,
  'streaming_strategy' : [] | [StreamingStrategy],
  'status_code' : number,
}
export type HeaderField = [string, string];
export type HeaderField__1 = [string, string];
export interface HourlyMetricsData {
  'updateCalls' : UpdateCallsAggregatedData,
  'canisterHeapMemorySize' : CanisterHeapMemoryAggregatedData,
  'canisterCycles' : CanisterCyclesAggregatedData,
  'canisterMemorySize' : CanisterMemoryAggregatedData,
  'timeMillis' : bigint,
}
export interface HttpRequest {
  'url' : string,
  'method' : string,
  'body' : Uint8Array,
  'headers' : Array<HeaderField>,
}
export interface ICTokenSpec {
  'fee' : bigint,
  'decimals' : bigint,
  'canister' : Principal,
  'standard' : { 'ICRC1' : null } |
    { 'EXTFungible' : null } |
    { 'DIP20' : null } |
    { 'Ledger' : null },
  'symbol' : string,
}
export interface InitArgs {
  'owner' : Principal,
  'storage_space' : [] | [bigint],
}
export interface LogEntry {
  'data' : CandyValue,
  'event' : string,
  'timestamp' : bigint,
  'caller' : [] | [Principal],
}
export interface LogMessagesData {
  'data' : Data,
  'timeNanos' : Nanos,
  'message' : string,
  'caller' : Caller,
}
export type ManageCollectionCommand = { 'UpdateOwner' : Principal } |
  { 'UpdateManagers' : Array<Principal> } |
  { 'UpdateMetadata' : [string, [] | [CandyValue], boolean] } |
  { 'UpdateNetwork' : [] | [Principal] } |
  { 'UpdateSymbol' : [] | [string] } |
  { 'UpdateLogo' : [] | [string] } |
  { 'UpdateName' : [] | [string] };
export type ManageSaleRequest = { 'bid' : BidRequest } |
  { 'escrow_deposit' : EscrowRequest } |
  { 'withdraw' : WithdrawRequest } |
  { 'end_sale' : string } |
  { 'refresh_offers' : [] | [Account] } |
  { 'distribute_sale' : DistributeSaleRequest } |
  { 'open_sale' : string };
export type ManageSaleResponse = { 'bid' : BidResponse } |
  { 'escrow_deposit' : EscrowResponse } |
  { 'withdraw' : WithdrawResponse } |
  { 'end_sale' : EndSaleResponse } |
  { 'refresh_offers' : Array<EscrowRecord> } |
  { 'distribute_sale' : DistributeSaleResponse } |
  { 'open_sale' : boolean };
export type ManageStorageRequest = {
    'add_storage_canisters' : Array<
      [Principal, bigint, [bigint, bigint, bigint]]
    >
  };
export type ManageStorageResponse = {
    'add_storage_canisters' : [bigint, bigint]
  };
export interface MarketTransferRequest {
  'token_id' : string,
  'sales_config' : SalesConfig,
}
export interface MarketTransferRequestReponse {
  'token_id' : string,
  'txn_type' : {
      'escrow_deposit' : {
        'token' : TokenSpec,
        'token_id' : string,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
      }
    } |
    {
      'canister_network_updated' : {
        'network' : Principal,
        'extensible' : CandyValue,
      }
    } |
    {
      'escrow_withdraw' : {
        'fee' : bigint,
        'token' : TokenSpec,
        'token_id' : string,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
      }
    } |
    {
      'canister_managers_updated' : {
        'managers' : Array<Principal>,
        'extensible' : CandyValue,
      }
    } |
    {
      'auction_bid' : {
        'token' : TokenSpec,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
        'sale_id' : string,
      }
    } |
    { 'burn' : null } |
    { 'data' : null } |
    {
      'sale_ended' : {
        'token' : TokenSpec,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
        'sale_id' : [] | [string],
      }
    } |
    {
      'mint' : {
        'to' : Account__1,
        'from' : Account__1,
        'sale' : [] | [{ 'token' : TokenSpec, 'amount' : bigint }],
        'extensible' : CandyValue,
      }
    } |
    {
      'royalty_paid' : {
        'tag' : string,
        'token' : TokenSpec,
        'reciever' : Account__1,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
        'sale_id' : [] | [string],
      }
    } |
    { 'extensible' : CandyValue } |
    {
      'owner_transfer' : {
        'to' : Account__1,
        'from' : Account__1,
        'extensible' : CandyValue,
      }
    } |
    {
      'sale_opened' : {
        'pricing' : PricingConfig,
        'extensible' : CandyValue,
        'sale_id' : string,
      }
    } |
    {
      'canister_owner_updated' : {
        'owner' : Principal,
        'extensible' : CandyValue,
      }
    } |
    {
      'sale_withdraw' : {
        'fee' : bigint,
        'token' : TokenSpec,
        'token_id' : string,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
      }
    } |
    {
      'deposit_withdraw' : {
        'fee' : bigint,
        'token' : TokenSpec,
        'trx_id' : TransactionID,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
      }
    },
  'timestamp' : bigint,
  'index' : bigint,
}
export type Memo = Uint8Array;
export type Metadata = {
    'fungible' : {
      'decimals' : number,
      'metadata' : [] | [Uint8Array],
      'name' : string,
      'symbol' : string,
    }
  } |
  { 'nonfungible' : { 'metadata' : [] | [Uint8Array] } };
export type MetricsGranularity = { 'hourly' : null } |
  { 'daily' : null };
export interface NFTBackupChunk {
  'sales_balances' : StableSalesBalances,
  'offers' : StableOffers,
  'collection_data' : StableCollectionData,
  'nft_ledgers' : StableNftLedger,
  'canister' : Principal,
  'allocations' : Array<[[string, string], AllocationRecordStable]>,
  'nft_sales' : Array<[string, SaleStatusStable]>,
  'buckets' : Array<[Principal, StableBucketData]>,
  'escrow_balances' : StableEscrowBalances,
}
export interface NFTInfoStable {
  'metadata' : CandyValue,
  'current_sale' : [] | [SaleStatusStable],
}
export type NFTUpdateRequest = {
    'update' : {
      'token_id' : string,
      'update' : UpdateRequest,
      'app_id' : string,
    }
  } |
  { 'replace' : { 'token_id' : string, 'data' : CandyValue } };
export type NFTUpdateResponse = boolean;
export type Nanos = bigint;
export type NftError = { 'UnauthorizedOperator' : null } |
  { 'SelfTransfer' : null } |
  { 'TokenNotFound' : null } |
  { 'UnauthorizedOwner' : null } |
  { 'TxNotFound' : null } |
  { 'SelfApprove' : null } |
  { 'OperatorNotFound' : null } |
  { 'ExistedNFT' : null } |
  { 'OwnerNotFound' : null } |
  { 'Other' : string };
export interface Nft_Canister {
  '__advance_time' : ActorMethod<[bigint], bigint>,
  '__set_time_mode' : ActorMethod<
    [{ 'test' : null } | { 'standard' : null }],
    boolean
  >,
  '__supports' : ActorMethod<[], Array<[string, string]>>,
  'back_up' : ActorMethod<
    [bigint],
    { 'eof' : NFTBackupChunk } |
      { 'data' : NFTBackupChunk }
  >,
  'balance' : ActorMethod<[BalanceRequest], BalanceResponse__1>,
  'balanceEXT' : ActorMethod<[BalanceRequest], BalanceResponse__1>,
  'balanceOfDip721' : ActorMethod<[Principal], bigint>,
  'balance_of_nft_origyn' : ActorMethod<[Account], Result_19>,
  'balance_of_secure_nft_origyn' : ActorMethod<[Account], Result_19>,
  'bearer' : ActorMethod<[TokenIdentifier], Result_18>,
  'bearerEXT' : ActorMethod<[TokenIdentifier], Result_18>,
  'bearer_batch_nft_origyn' : ActorMethod<[Array<string>], Array<Result_17>>,
  'bearer_batch_secure_nft_origyn' : ActorMethod<
    [Array<string>],
    Array<Result_17>
  >,
  'bearer_nft_origyn' : ActorMethod<[string], Result_17>,
  'bearer_secure_nft_origyn' : ActorMethod<[string], Result_17>,
  'canister_status' : ActorMethod<
    [{ 'canister_id' : canister_id }],
    canister_status
  >,
  'chunk_nft_origyn' : ActorMethod<[ChunkRequest], Result_16>,
  'chunk_secure_nft_origyn' : ActorMethod<[ChunkRequest], Result_16>,
  'collectCanisterMetrics' : ActorMethod<[], undefined>,
  'collection_nft_origyn' : ActorMethod<
    [[] | [Array<[string, [] | [bigint], [] | [bigint]]>]],
    Result_15
  >,
  'collection_secure_nft_origyn' : ActorMethod<
    [[] | [Array<[string, [] | [bigint], [] | [bigint]]>]],
    Result_15
  >,
  'collection_update_batch_nft_origyn' : ActorMethod<
    [Array<ManageCollectionCommand>],
    Array<Result_14>
  >,
  'collection_update_nft_origyn' : ActorMethod<
    [ManageCollectionCommand],
    Result_14
  >,
  'current_log' : ActorMethod<[], Array<LogEntry>>,
  'cycles' : ActorMethod<[], bigint>,
  'getCanisterLog' : ActorMethod<
    [[] | [CanisterLogRequest]],
    [] | [CanisterLogResponse]
  >,
  'getCanisterMetrics' : ActorMethod<
    [GetMetricsParameters],
    [] | [CanisterMetrics]
  >,
  'getEXTTokenIdentifier' : ActorMethod<[string], string>,
  'get_access_key' : ActorMethod<[], Result_3>,
  'get_halt' : ActorMethod<[], boolean>,
  'get_nat_as_token_id_origyn' : ActorMethod<[bigint], string>,
  'get_token_id_as_nat_origyn' : ActorMethod<[string], bigint>,
  'governance_nft_origyn' : ActorMethod<[GovernanceRequest], Result_13>,
  'harvest_log' : ActorMethod<[bigint], Array<Array<LogEntry>>>,
  'history_batch_nft_origyn' : ActorMethod<
    [Array<[string, [] | [bigint], [] | [bigint]]>],
    Array<Result_12>
  >,
  'history_batch_secure_nft_origyn' : ActorMethod<
    [Array<[string, [] | [bigint], [] | [bigint]]>],
    Array<Result_12>
  >,
  'history_nft_origyn' : ActorMethod<
    [string, [] | [bigint], [] | [bigint]],
    Result_12
  >,
  'history_secure_nft_origyn' : ActorMethod<
    [string, [] | [bigint], [] | [bigint]],
    Result_12
  >,
  'http_access_key' : ActorMethod<[], Result_3>,
  'http_request' : ActorMethod<[HttpRequest], HTTPResponse>,
  'http_request_streaming_callback' : ActorMethod<
    [StreamingCallbackToken],
    StreamingCallbackResponse
  >,
  'log_history_page' : ActorMethod<[bigint], Array<LogEntry>>,
  'log_history_page_chunk' : ActorMethod<
    [bigint, bigint, bigint],
    Array<LogEntry>
  >,
  'log_history_size' : ActorMethod<[], bigint>,
  'manage_storage_nft_origyn' : ActorMethod<[ManageStorageRequest], Result_11>,
  'market_transfer_batch_nft_origyn' : ActorMethod<
    [Array<MarketTransferRequest>],
    Array<Result_10>
  >,
  'market_transfer_nft_origyn' : ActorMethod<
    [MarketTransferRequest],
    Result_10
  >,
  'metadata' : ActorMethod<[TokenIdentifier], Result_9>,
  'mint_batch_nft_origyn' : ActorMethod<
    [Array<[string, Account]>],
    Array<Result_3>
  >,
  'mint_nft_origyn' : ActorMethod<[string, Account], Result_3>,
  'nftStreamingCallback' : ActorMethod<
    [StreamingCallbackToken],
    StreamingCallbackResponse
  >,
  'nft_batch_origyn' : ActorMethod<[Array<string>], Array<Result_8>>,
  'nft_batch_secure_origyn' : ActorMethod<[Array<string>], Array<Result_8>>,
  'nft_origyn' : ActorMethod<[string], Result_8>,
  'nft_secure_origyn' : ActorMethod<[string], Result_8>,
  'nuke_log' : ActorMethod<[], undefined>,
  'ownerOf' : ActorMethod<[bigint], OwnerOfResponse>,
  'ownerOfDIP721' : ActorMethod<[bigint], OwnerOfResponse>,
  'sale_batch_nft_origyn' : ActorMethod<
    [Array<ManageSaleRequest>],
    Array<Result_6>
  >,
  'sale_info_batch_nft_origyn' : ActorMethod<
    [Array<SaleInfoRequest>],
    Array<Result_7>
  >,
  'sale_info_batch_secure_nft_origyn' : ActorMethod<
    [Array<SaleInfoRequest>],
    Array<Result_7>
  >,
  'sale_info_nft_origyn' : ActorMethod<[SaleInfoRequest], Result_7>,
  'sale_info_secure_nft_origyn' : ActorMethod<[SaleInfoRequest], Result_7>,
  'sale_nft_origyn' : ActorMethod<[ManageSaleRequest], Result_6>,
  'set_data_harvester' : ActorMethod<[bigint], undefined>,
  'set_halt' : ActorMethod<[boolean], undefined>,
  'set_log_harvester_id' : ActorMethod<[Principal], undefined>,
  'share_wallet_nft_origyn' : ActorMethod<[ShareWalletRequest], Result_5>,
  'stage_batch_nft_origyn' : ActorMethod<
    [Array<{ 'metadata' : CandyValue }>],
    Array<Result_3>
  >,
  'stage_library_batch_nft_origyn' : ActorMethod<
    [Array<StageChunkArg>],
    Array<Result_4>
  >,
  'stage_library_nft_origyn' : ActorMethod<[StageChunkArg], Result_4>,
  'stage_nft_origyn' : ActorMethod<[{ 'metadata' : CandyValue }], Result_3>,
  'state_size' : ActorMethod<[], StateSize>,
  'storage_info_nft_origyn' : ActorMethod<[], Result_2>,
  'storage_info_secure_nft_origyn' : ActorMethod<[], Result_2>,
  'tokens_ext' : ActorMethod<[string], Result_1>,
  'transfer' : ActorMethod<[TransferRequest], TransferResponse>,
  'transferDip721' : ActorMethod<[Principal, bigint], Result__1>,
  'transferEXT' : ActorMethod<[TransferRequest], TransferResponse>,
  'transferFrom' : ActorMethod<[Principal, Principal, bigint], Result__1>,
  'transferFromDip721' : ActorMethod<[Principal, Principal, bigint], Result__1>,
  'update_app_nft_origyn' : ActorMethod<[NFTUpdateRequest], Result>,
  'wallet_receive' : ActorMethod<[], bigint>,
  'whoami' : ActorMethod<[], Principal>,
}
export interface NumericEntity {
  'avg' : bigint,
  'max' : bigint,
  'min' : bigint,
  'first' : bigint,
  'last' : bigint,
}
export interface OrigynError {
  'text' : string,
  'error' : Errors,
  'number' : number,
  'flag_point' : string,
}
export type OwnerOfResponse = { 'Ok' : [] | [Principal] } |
  { 'Err' : NftError };
export interface OwnerTransferResponse {
  'transaction' : TransactionRecord,
  'assets' : Array<CandyValue>,
}
export type PricingConfig = {
    'flat' : { 'token' : TokenSpec, 'amount' : bigint }
  } |
  { 'extensible' : { 'candyClass' : null } } |
  { 'instant' : null } |
  { 'auction' : AuctionConfig } |
  {
    'dutch' : {
      'start_price' : bigint,
      'reserve' : [] | [bigint],
      'decay_per_hour' : number,
    }
  };
export type PricingConfig__1 = {
    'flat' : { 'token' : TokenSpec, 'amount' : bigint }
  } |
  { 'extensible' : { 'candyClass' : null } } |
  { 'instant' : null } |
  { 'auction' : AuctionConfig } |
  {
    'dutch' : {
      'start_price' : bigint,
      'reserve' : [] | [bigint],
      'decay_per_hour' : number,
    }
  };
export type Principal = Principal;
export interface Property {
  'value' : CandyValue,
  'name' : string,
  'immutable' : boolean,
}
export interface RejectDescription {
  'token' : TokenSpec__1,
  'token_id' : string,
  'seller' : Account,
  'buyer' : Account,
}
export type Result = { 'ok' : NFTUpdateResponse } |
  { 'err' : OrigynError };
export type Result_1 = { 'ok' : Array<EXTTokensResult> } |
  { 'err' : CommonError };
export type Result_10 = { 'ok' : MarketTransferRequestReponse } |
  { 'err' : OrigynError };
export type Result_11 = { 'ok' : ManageStorageResponse } |
  { 'err' : OrigynError };
export type Result_12 = { 'ok' : Array<TransactionRecord> } |
  { 'err' : OrigynError };
export type Result_13 = { 'ok' : GovernanceResponse } |
  { 'err' : OrigynError };
export type Result_14 = { 'ok' : boolean } |
  { 'err' : OrigynError };
export type Result_15 = { 'ok' : CollectionInfo } |
  { 'err' : OrigynError };
export type Result_16 = { 'ok' : ChunkContent } |
  { 'err' : OrigynError };
export type Result_17 = { 'ok' : Account } |
  { 'err' : OrigynError };
export type Result_18 = { 'ok' : AccountIdentifier } |
  { 'err' : CommonError };
export type Result_19 = { 'ok' : BalanceResponse } |
  { 'err' : OrigynError };
export type Result_2 = { 'ok' : StorageMetrics } |
  { 'err' : OrigynError };
export type Result_3 = { 'ok' : string } |
  { 'err' : OrigynError };
export type Result_4 = { 'ok' : StageLibraryResponse } |
  { 'err' : OrigynError };
export type Result_5 = { 'ok' : OwnerTransferResponse } |
  { 'err' : OrigynError };
export type Result_6 = { 'ok' : ManageSaleResponse } |
  { 'err' : OrigynError };
export type Result_7 = { 'ok' : SaleInfoResponse } |
  { 'err' : OrigynError };
export type Result_8 = { 'ok' : NFTInfoStable } |
  { 'err' : OrigynError };
export type Result_9 = { 'ok' : Metadata } |
  { 'err' : CommonError };
export type Result__1 = { 'Ok' : bigint } |
  { 'Err' : NftError };
export type SaleInfoRequest = { 'status' : string } |
  { 'active' : [] | [[bigint, bigint]] } |
  { 'deposit_info' : [] | [Account] } |
  { 'history' : [] | [[bigint, bigint]] };
export type SaleInfoResponse = { 'status' : [] | [SaleStatusStable] } |
  {
    'active' : {
      'eof' : boolean,
      'records' : Array<[string, [] | [SaleStatusStable]]>,
      'count' : bigint,
    }
  } |
  { 'deposit_info' : SubAccountInfo } |
  {
    'history' : {
      'eof' : boolean,
      'records' : Array<[] | [SaleStatusStable]>,
      'count' : bigint,
    }
  };
export interface SaleStatusStable {
  'token_id' : string,
  'sale_type' : { 'auction' : AuctionStateStable },
  'broker_id' : [] | [Principal],
  'original_broker_id' : [] | [Principal],
  'sale_id' : string,
}
export interface SalesConfig {
  'broker_id' : [] | [Principal],
  'pricing' : PricingConfig__1,
  'escrow_receipt' : [] | [EscrowReceipt],
}
export interface ShareWalletRequest {
  'to' : Account,
  'token_id' : string,
  'from' : Account,
}
export interface StableBucketData {
  'principal' : Principal,
  'allocated_space' : bigint,
  'date_added' : bigint,
  'version' : [bigint, bigint, bigint],
  'b_gateway' : boolean,
  'available_space' : bigint,
  'allocations' : Array<[[string, string], bigint]>,
}
export interface StableCollectionData {
  'active_bucket' : [] | [Principal],
  'managers' : Array<Principal>,
  'owner' : Principal,
  'metadata' : [] | [CandyValue],
  'logo' : [] | [string],
  'name' : [] | [string],
  'network' : [] | [Principal],
  'available_space' : bigint,
  'symbol' : [] | [string],
  'allocated_storage' : bigint,
}
export type StableEscrowBalances = Array<
  [Account, Account, string, EscrowRecord]
>;
export type StableNftLedger = Array<[string, TransactionRecord]>;
export type StableOffers = Array<[Account, Account, bigint]>;
export type StableSalesBalances = Array<
  [Account, Account, string, EscrowRecord]
>;
export interface StageChunkArg {
  'content' : Uint8Array,
  'token_id' : string,
  'chunk' : bigint,
  'filedata' : CandyValue,
  'library_id' : string,
}
export interface StageLibraryResponse { 'canister' : Principal }
export interface StakeRecord {
  'staker' : Account,
  'token_id' : string,
  'amount' : bigint,
}
export interface StateSize {
  'sales_balances' : bigint,
  'offers' : bigint,
  'nft_ledgers' : bigint,
  'allocations' : bigint,
  'nft_sales' : bigint,
  'buckets' : bigint,
  'escrow_balances' : bigint,
}
export interface StorageMetrics {
  'available_space' : bigint,
  'allocations' : Array<AllocationRecordStable>,
  'allocated_storage' : bigint,
}
export interface StreamingCallbackResponse {
  'token' : [] | [StreamingCallbackToken],
  'body' : Uint8Array,
}
export interface StreamingCallbackToken {
  'key' : string,
  'index' : bigint,
  'content_encoding' : string,
}
export type StreamingStrategy = {
    'Callback' : {
      'token' : StreamingCallbackToken,
      'callback' : [Principal, string],
    }
  };
export type SubAccount = Uint8Array;
export interface SubAccountInfo {
  'account_id' : Uint8Array,
  'principal' : Principal,
  'account_id_text' : string,
  'account' : { 'principal' : Principal, 'sub_account' : Uint8Array },
}
export type TokenIdentifier = string;
export type TokenSpec = { 'ic' : ICTokenSpec } |
  { 'extensible' : CandyValue };
export type TokenSpec__1 = { 'ic' : ICTokenSpec } |
  { 'extensible' : CandyValue };
export type TransactionID = { 'nat' : bigint } |
  { 'text' : string } |
  { 'extensible' : CandyValue };
export type TransactionID__1 = { 'nat' : bigint } |
  { 'text' : string } |
  { 'extensible' : CandyValue };
export interface TransactionRecord {
  'token_id' : string,
  'txn_type' : {
      'escrow_deposit' : {
        'token' : TokenSpec,
        'token_id' : string,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
      }
    } |
    {
      'canister_network_updated' : {
        'network' : Principal,
        'extensible' : CandyValue,
      }
    } |
    {
      'escrow_withdraw' : {
        'fee' : bigint,
        'token' : TokenSpec,
        'token_id' : string,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
      }
    } |
    {
      'canister_managers_updated' : {
        'managers' : Array<Principal>,
        'extensible' : CandyValue,
      }
    } |
    {
      'auction_bid' : {
        'token' : TokenSpec,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
        'sale_id' : string,
      }
    } |
    { 'burn' : null } |
    { 'data' : null } |
    {
      'sale_ended' : {
        'token' : TokenSpec,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
        'sale_id' : [] | [string],
      }
    } |
    {
      'mint' : {
        'to' : Account__1,
        'from' : Account__1,
        'sale' : [] | [{ 'token' : TokenSpec, 'amount' : bigint }],
        'extensible' : CandyValue,
      }
    } |
    {
      'royalty_paid' : {
        'tag' : string,
        'token' : TokenSpec,
        'reciever' : Account__1,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
        'sale_id' : [] | [string],
      }
    } |
    { 'extensible' : CandyValue } |
    {
      'owner_transfer' : {
        'to' : Account__1,
        'from' : Account__1,
        'extensible' : CandyValue,
      }
    } |
    {
      'sale_opened' : {
        'pricing' : PricingConfig,
        'extensible' : CandyValue,
        'sale_id' : string,
      }
    } |
    {
      'canister_owner_updated' : {
        'owner' : Principal,
        'extensible' : CandyValue,
      }
    } |
    {
      'sale_withdraw' : {
        'fee' : bigint,
        'token' : TokenSpec,
        'token_id' : string,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
      }
    } |
    {
      'deposit_withdraw' : {
        'fee' : bigint,
        'token' : TokenSpec,
        'trx_id' : TransactionID,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
      }
    },
  'timestamp' : bigint,
  'index' : bigint,
}
export interface TransferRequest {
  'to' : User,
  'token' : TokenIdentifier,
  'notify' : boolean,
  'from' : User,
  'memo' : Memo,
  'subaccount' : [] | [SubAccount],
  'amount' : Balance,
}
export type TransferResponse = { 'ok' : Balance } |
  {
    'err' : { 'CannotNotify' : AccountIdentifier } |
      { 'InsufficientBalance' : null } |
      { 'InvalidToken' : TokenIdentifier } |
      { 'Rejected' : null } |
      { 'Unauthorized' : AccountIdentifier } |
      { 'Other' : string }
  };
export interface Update { 'mode' : UpdateMode, 'name' : string }
export type UpdateCallsAggregatedData = BigUint64Array;
export type UpdateMode = { 'Set' : CandyValue } |
  { 'Lock' : CandyValue } |
  { 'Next' : Array<Update> };
export interface UpdateRequest { 'id' : string, 'update' : Array<Update> }
export type User = { 'principal' : Principal } |
  { 'address' : AccountIdentifier };
export interface WithdrawDescription {
  'token' : TokenSpec__1,
  'token_id' : string,
  'seller' : Account,
  'withdraw_to' : Account,
  'buyer' : Account,
  'amount' : bigint,
}
export type WithdrawRequest = { 'reject' : RejectDescription } |
  { 'sale' : WithdrawDescription } |
  { 'deposit' : DepositWithdrawDescription } |
  { 'escrow' : WithdrawDescription };
export interface WithdrawResponse {
  'token_id' : string,
  'txn_type' : {
      'escrow_deposit' : {
        'token' : TokenSpec,
        'token_id' : string,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
      }
    } |
    {
      'canister_network_updated' : {
        'network' : Principal,
        'extensible' : CandyValue,
      }
    } |
    {
      'escrow_withdraw' : {
        'fee' : bigint,
        'token' : TokenSpec,
        'token_id' : string,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
      }
    } |
    {
      'canister_managers_updated' : {
        'managers' : Array<Principal>,
        'extensible' : CandyValue,
      }
    } |
    {
      'auction_bid' : {
        'token' : TokenSpec,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
        'sale_id' : string,
      }
    } |
    { 'burn' : null } |
    { 'data' : null } |
    {
      'sale_ended' : {
        'token' : TokenSpec,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
        'sale_id' : [] | [string],
      }
    } |
    {
      'mint' : {
        'to' : Account__1,
        'from' : Account__1,
        'sale' : [] | [{ 'token' : TokenSpec, 'amount' : bigint }],
        'extensible' : CandyValue,
      }
    } |
    {
      'royalty_paid' : {
        'tag' : string,
        'token' : TokenSpec,
        'reciever' : Account__1,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
        'sale_id' : [] | [string],
      }
    } |
    { 'extensible' : CandyValue } |
    {
      'owner_transfer' : {
        'to' : Account__1,
        'from' : Account__1,
        'extensible' : CandyValue,
      }
    } |
    {
      'sale_opened' : {
        'pricing' : PricingConfig,
        'extensible' : CandyValue,
        'sale_id' : string,
      }
    } |
    {
      'canister_owner_updated' : {
        'owner' : Principal,
        'extensible' : CandyValue,
      }
    } |
    {
      'sale_withdraw' : {
        'fee' : bigint,
        'token' : TokenSpec,
        'token_id' : string,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
      }
    } |
    {
      'deposit_withdraw' : {
        'fee' : bigint,
        'token' : TokenSpec,
        'trx_id' : TransactionID,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : bigint,
      }
    },
  'timestamp' : bigint,
  'index' : bigint,
}
export type canister_id = Principal;
export interface canister_status {
  'status' : { 'stopped' : null } |
    { 'stopping' : null } |
    { 'running' : null },
  'memory_size' : bigint,
  'cycles' : bigint,
  'settings' : definite_canister_settings,
  'module_hash' : [] | [Uint8Array],
}
export interface definite_canister_settings {
  'freezing_threshold' : bigint,
  'controllers' : [] | [Array<Principal>],
  'memory_allocation' : bigint,
  'compute_allocation' : bigint,
}
export interface _SERVICE extends Nft_Canister {}
