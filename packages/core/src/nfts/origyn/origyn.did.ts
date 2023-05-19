export const idlFactory = ({ IDL }) => {
  const CandyValue = IDL.Rec();
  const Result_6 = IDL.Rec();
  const Update = IDL.Rec();
  const Principal = IDL.Principal;
  const InitArgs = IDL.Record({
    'owner' : Principal,
    'storage_space' : IDL.Opt(IDL.Nat),
  });
  const Property = IDL.Record({
    'value' : CandyValue,
    'name' : IDL.Text,
    'immutable' : IDL.Bool,
  });
  CandyValue.fill(
    IDL.Variant({
      'Int' : IDL.Int,
      'Nat' : IDL.Nat,
      'Empty' : IDL.Null,
      'Nat16' : IDL.Nat16,
      'Nat32' : IDL.Nat32,
      'Nat64' : IDL.Nat64,
      'Blob' : IDL.Vec(IDL.Nat8),
      'Bool' : IDL.Bool,
      'Int8' : IDL.Int8,
      'Nat8' : IDL.Nat8,
      'Nats' : IDL.Variant({
        'thawed' : IDL.Vec(IDL.Nat),
        'frozen' : IDL.Vec(IDL.Nat),
      }),
      'Text' : IDL.Text,
      'Bytes' : IDL.Variant({
        'thawed' : IDL.Vec(IDL.Nat8),
        'frozen' : IDL.Vec(IDL.Nat8),
      }),
      'Int16' : IDL.Int16,
      'Int32' : IDL.Int32,
      'Int64' : IDL.Int64,
      'Option' : IDL.Opt(CandyValue),
      'Floats' : IDL.Variant({
        'thawed' : IDL.Vec(IDL.Float64),
        'frozen' : IDL.Vec(IDL.Float64),
      }),
      'Float' : IDL.Float64,
      'Principal' : IDL.Principal,
      'Array' : IDL.Variant({
        'thawed' : IDL.Vec(CandyValue),
        'frozen' : IDL.Vec(CandyValue),
      }),
      'Class' : IDL.Vec(Property),
    })
  );
  const Account = IDL.Variant({
    'account_id' : IDL.Text,
    'principal' : IDL.Principal,
    'extensible' : CandyValue,
    'account' : IDL.Record({
      'owner' : IDL.Principal,
      'sub_account' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    }),
  });
  const ICTokenSpec = IDL.Record({
    'fee' : IDL.Nat,
    'decimals' : IDL.Nat,
    'canister' : IDL.Principal,
    'standard' : IDL.Variant({
      'ICRC1' : IDL.Null,
      'EXTFungible' : IDL.Null,
      'DIP20' : IDL.Null,
      'Ledger' : IDL.Null,
    }),
    'symbol' : IDL.Text,
  });
  const TokenSpec = IDL.Variant({
    'ic' : ICTokenSpec,
    'extensible' : CandyValue,
  });
  const Account__1 = IDL.Variant({
    'account_id' : IDL.Text,
    'principal' : IDL.Principal,
    'extensible' : CandyValue,
    'account' : IDL.Record({
      'owner' : IDL.Principal,
      'sub_account' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    }),
  });
  const EscrowRecord = IDL.Record({
    'token' : TokenSpec,
    'token_id' : IDL.Text,
    'seller' : Account__1,
    'lock_to_date' : IDL.Opt(IDL.Int),
    'buyer' : Account__1,
    'amount' : IDL.Nat,
    'sale_id' : IDL.Opt(IDL.Text),
    'account_hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const StableSalesBalances = IDL.Vec(
    IDL.Tuple(Account, Account, IDL.Text, EscrowRecord)
  );
  const StableOffers = IDL.Vec(IDL.Tuple(Account, Account, IDL.Int));
  const StableCollectionData = IDL.Record({
    'active_bucket' : IDL.Opt(IDL.Principal),
    'managers' : IDL.Vec(IDL.Principal),
    'owner' : IDL.Principal,
    'metadata' : IDL.Opt(CandyValue),
    'logo' : IDL.Opt(IDL.Text),
    'name' : IDL.Opt(IDL.Text),
    'network' : IDL.Opt(IDL.Principal),
    'available_space' : IDL.Nat,
    'symbol' : IDL.Opt(IDL.Text),
    'allocated_storage' : IDL.Nat,
  });
  const TransactionID = IDL.Variant({
    'nat' : IDL.Nat,
    'text' : IDL.Text,
    'extensible' : CandyValue,
  });
  const AuctionConfig = IDL.Record({
    'start_price' : IDL.Nat,
    'token' : TokenSpec,
    'reserve' : IDL.Opt(IDL.Nat),
    'start_date' : IDL.Int,
    'min_increase' : IDL.Variant({
      'amount' : IDL.Nat,
      'percentage' : IDL.Float64,
    }),
    'allow_list' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'buy_now' : IDL.Opt(IDL.Nat),
    'ending' : IDL.Variant({
      'waitForQuiet' : IDL.Record({
        'max' : IDL.Nat,
        'date' : IDL.Int,
        'fade' : IDL.Float64,
        'extention' : IDL.Nat64,
      }),
      'date' : IDL.Int,
    }),
  });
  const PricingConfig = IDL.Variant({
    'flat' : IDL.Record({ 'token' : TokenSpec, 'amount' : IDL.Nat }),
    'extensible' : IDL.Variant({ 'candyClass' : IDL.Null }),
    'instant' : IDL.Null,
    'auction' : AuctionConfig,
    'dutch' : IDL.Record({
      'start_price' : IDL.Nat,
      'reserve' : IDL.Opt(IDL.Nat),
      'decay_per_hour' : IDL.Float64,
    }),
  });
  const TransactionRecord = IDL.Record({
    'token_id' : IDL.Text,
    'txn_type' : IDL.Variant({
      'escrow_deposit' : IDL.Record({
        'token' : TokenSpec,
        'token_id' : IDL.Text,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
      }),
      'canister_network_updated' : IDL.Record({
        'network' : IDL.Principal,
        'extensible' : CandyValue,
      }),
      'escrow_withdraw' : IDL.Record({
        'fee' : IDL.Nat,
        'token' : TokenSpec,
        'token_id' : IDL.Text,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
      }),
      'canister_managers_updated' : IDL.Record({
        'managers' : IDL.Vec(IDL.Principal),
        'extensible' : CandyValue,
      }),
      'auction_bid' : IDL.Record({
        'token' : TokenSpec,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
        'sale_id' : IDL.Text,
      }),
      'burn' : IDL.Null,
      'data' : IDL.Null,
      'sale_ended' : IDL.Record({
        'token' : TokenSpec,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
        'sale_id' : IDL.Opt(IDL.Text),
      }),
      'mint' : IDL.Record({
        'to' : Account__1,
        'from' : Account__1,
        'sale' : IDL.Opt(
          IDL.Record({ 'token' : TokenSpec, 'amount' : IDL.Nat })
        ),
        'extensible' : CandyValue,
      }),
      'royalty_paid' : IDL.Record({
        'tag' : IDL.Text,
        'token' : TokenSpec,
        'reciever' : Account__1,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
        'sale_id' : IDL.Opt(IDL.Text),
      }),
      'extensible' : CandyValue,
      'owner_transfer' : IDL.Record({
        'to' : Account__1,
        'from' : Account__1,
        'extensible' : CandyValue,
      }),
      'sale_opened' : IDL.Record({
        'pricing' : PricingConfig,
        'extensible' : CandyValue,
        'sale_id' : IDL.Text,
      }),
      'canister_owner_updated' : IDL.Record({
        'owner' : IDL.Principal,
        'extensible' : CandyValue,
      }),
      'sale_withdraw' : IDL.Record({
        'fee' : IDL.Nat,
        'token' : TokenSpec,
        'token_id' : IDL.Text,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
      }),
      'deposit_withdraw' : IDL.Record({
        'fee' : IDL.Nat,
        'token' : TokenSpec,
        'trx_id' : TransactionID,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
      }),
    }),
    'timestamp' : IDL.Int,
    'index' : IDL.Nat,
  });
  const StableNftLedger = IDL.Vec(IDL.Tuple(IDL.Text, TransactionRecord));
  const AllocationRecordStable = IDL.Record({
    'allocated_space' : IDL.Nat,
    'token_id' : IDL.Text,
    'available_space' : IDL.Nat,
    'canister' : IDL.Principal,
    'chunks' : IDL.Vec(IDL.Nat),
    'library_id' : IDL.Text,
  });
  const EscrowReceipt = IDL.Record({
    'token' : TokenSpec,
    'token_id' : IDL.Text,
    'seller' : Account__1,
    'buyer' : Account__1,
    'amount' : IDL.Nat,
  });
  const PricingConfig__1 = IDL.Variant({
    'flat' : IDL.Record({ 'token' : TokenSpec, 'amount' : IDL.Nat }),
    'extensible' : IDL.Variant({ 'candyClass' : IDL.Null }),
    'instant' : IDL.Null,
    'auction' : AuctionConfig,
    'dutch' : IDL.Record({
      'start_price' : IDL.Nat,
      'reserve' : IDL.Opt(IDL.Nat),
      'decay_per_hour' : IDL.Float64,
    }),
  });
  const AuctionStateStable = IDL.Record({
    'status' : IDL.Variant({
      'closed' : IDL.Null,
      'open' : IDL.Null,
      'not_started' : IDL.Null,
    }),
    'participants' : IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Int)),
    'current_bid_amount' : IDL.Nat,
    'winner' : IDL.Opt(Account),
    'end_date' : IDL.Int,
    'wait_for_quiet_count' : IDL.Opt(IDL.Nat),
    'current_escrow' : IDL.Opt(EscrowReceipt),
    'allow_list' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Bool))),
    'current_broker_id' : IDL.Opt(IDL.Principal),
    'min_next_bid' : IDL.Nat,
    'config' : PricingConfig__1,
  });
  const SaleStatusStable = IDL.Record({
    'token_id' : IDL.Text,
    'sale_type' : IDL.Variant({ 'auction' : AuctionStateStable }),
    'broker_id' : IDL.Opt(IDL.Principal),
    'original_broker_id' : IDL.Opt(IDL.Principal),
    'sale_id' : IDL.Text,
  });
  const StableBucketData = IDL.Record({
    'principal' : IDL.Principal,
    'allocated_space' : IDL.Nat,
    'date_added' : IDL.Int,
    'version' : IDL.Tuple(IDL.Nat, IDL.Nat, IDL.Nat),
    'b_gateway' : IDL.Bool,
    'available_space' : IDL.Nat,
    'allocations' : IDL.Vec(IDL.Tuple(IDL.Tuple(IDL.Text, IDL.Text), IDL.Int)),
  });
  const StableEscrowBalances = IDL.Vec(
    IDL.Tuple(Account, Account, IDL.Text, EscrowRecord)
  );
  const NFTBackupChunk = IDL.Record({
    'sales_balances' : StableSalesBalances,
    'offers' : StableOffers,
    'collection_data' : StableCollectionData,
    'nft_ledgers' : StableNftLedger,
    'canister' : IDL.Principal,
    'allocations' : IDL.Vec(
      IDL.Tuple(IDL.Tuple(IDL.Text, IDL.Text), AllocationRecordStable)
    ),
    'nft_sales' : IDL.Vec(IDL.Tuple(IDL.Text, SaleStatusStable)),
    'buckets' : IDL.Vec(IDL.Tuple(IDL.Principal, StableBucketData)),
    'escrow_balances' : StableEscrowBalances,
  });
  const TokenIdentifier = IDL.Text;
  const AccountIdentifier = IDL.Text;
  const User = IDL.Variant({
    'principal' : IDL.Principal,
    'address' : AccountIdentifier,
  });
  const BalanceRequest = IDL.Record({
    'token' : TokenIdentifier,
    'user' : User,
  });
  const Balance = IDL.Nat;
  const CommonError = IDL.Variant({
    'InvalidToken' : TokenIdentifier,
    'Other' : IDL.Text,
  });
  const BalanceResponse__1 = IDL.Variant({
    'ok' : Balance,
    'err' : CommonError,
  });
  const StakeRecord = IDL.Record({
    'staker' : Account,
    'token_id' : IDL.Text,
    'amount' : IDL.Nat,
  });
  const BalanceResponse = IDL.Record({
    'nfts' : IDL.Vec(IDL.Text),
    'offers' : IDL.Vec(EscrowRecord),
    'sales' : IDL.Vec(EscrowRecord),
    'stake' : IDL.Vec(StakeRecord),
    'multi_canister' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'escrow' : IDL.Vec(EscrowRecord),
  });
  const Errors = IDL.Variant({
    'nyi' : IDL.Null,
    'storage_configuration_error' : IDL.Null,
    'escrow_withdraw_payment_failed' : IDL.Null,
    'token_not_found' : IDL.Null,
    'owner_not_found' : IDL.Null,
    'content_not_found' : IDL.Null,
    'auction_ended' : IDL.Null,
    'out_of_range' : IDL.Null,
    'sale_id_does_not_match' : IDL.Null,
    'sale_not_found' : IDL.Null,
    'item_not_owned' : IDL.Null,
    'property_not_found' : IDL.Null,
    'validate_trx_wrong_host' : IDL.Null,
    'withdraw_too_large' : IDL.Null,
    'content_not_deserializable' : IDL.Null,
    'bid_too_low' : IDL.Null,
    'validate_deposit_wrong_amount' : IDL.Null,
    'existing_sale_found' : IDL.Null,
    'asset_mismatch' : IDL.Null,
    'escrow_cannot_be_removed' : IDL.Null,
    'deposit_burned' : IDL.Null,
    'cannot_restage_minted_token' : IDL.Null,
    'cannot_find_status_in_metadata' : IDL.Null,
    'receipt_data_mismatch' : IDL.Null,
    'validate_deposit_failed' : IDL.Null,
    'unreachable' : IDL.Null,
    'unauthorized_access' : IDL.Null,
    'item_already_minted' : IDL.Null,
    'no_escrow_found' : IDL.Null,
    'escrow_owner_not_the_owner' : IDL.Null,
    'improper_interface' : IDL.Null,
    'app_id_not_found' : IDL.Null,
    'token_non_transferable' : IDL.Null,
    'sale_not_over' : IDL.Null,
    'update_class_error' : IDL.Null,
    'malformed_metadata' : IDL.Null,
    'token_id_mismatch' : IDL.Null,
    'id_not_found_in_metadata' : IDL.Null,
    'auction_not_started' : IDL.Null,
    'library_not_found' : IDL.Null,
    'attempt_to_stage_system_data' : IDL.Null,
    'validate_deposit_wrong_buyer' : IDL.Null,
    'not_enough_storage' : IDL.Null,
    'sales_withdraw_payment_failed' : IDL.Null,
  });
  const OrigynError = IDL.Record({
    'text' : IDL.Text,
    'error' : Errors,
    'number' : IDL.Nat32,
    'flag_point' : IDL.Text,
  });
  const Result_19 = IDL.Variant({
    'ok' : BalanceResponse,
    'err' : OrigynError,
  });
  const Result_18 = IDL.Variant({
    'ok' : AccountIdentifier,
    'err' : CommonError,
  });
  const Result_17 = IDL.Variant({ 'ok' : Account, 'err' : OrigynError });
  const canister_id = IDL.Principal;
  const definite_canister_settings = IDL.Record({
    'freezing_threshold' : IDL.Nat,
    'controllers' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'memory_allocation' : IDL.Nat,
    'compute_allocation' : IDL.Nat,
  });
  const canister_status = IDL.Record({
    'status' : IDL.Variant({
      'stopped' : IDL.Null,
      'stopping' : IDL.Null,
      'running' : IDL.Null,
    }),
    'memory_size' : IDL.Nat,
    'cycles' : IDL.Nat,
    'settings' : definite_canister_settings,
    'module_hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const ChunkRequest = IDL.Record({
    'token_id' : IDL.Text,
    'chunk' : IDL.Opt(IDL.Nat),
    'library_id' : IDL.Text,
  });
  const ChunkContent = IDL.Variant({
    'remote' : IDL.Record({
      'args' : ChunkRequest,
      'canister' : IDL.Principal,
    }),
    'chunk' : IDL.Record({
      'total_chunks' : IDL.Nat,
      'content' : IDL.Vec(IDL.Nat8),
      'storage_allocation' : AllocationRecordStable,
      'current_chunk' : IDL.Opt(IDL.Nat),
    }),
  });
  const Result_16 = IDL.Variant({ 'ok' : ChunkContent, 'err' : OrigynError });
  const CollectionInfo = IDL.Record({
    'multi_canister_count' : IDL.Opt(IDL.Nat),
    'managers' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'owner' : IDL.Opt(IDL.Principal),
    'metadata' : IDL.Opt(CandyValue),
    'logo' : IDL.Opt(IDL.Text),
    'name' : IDL.Opt(IDL.Text),
    'network' : IDL.Opt(IDL.Principal),
    'fields' : IDL.Opt(
      IDL.Vec(IDL.Tuple(IDL.Text, IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)))
    ),
    'token_ids_count' : IDL.Opt(IDL.Nat),
    'available_space' : IDL.Opt(IDL.Nat),
    'multi_canister' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'token_ids' : IDL.Opt(IDL.Vec(IDL.Text)),
    'total_supply' : IDL.Opt(IDL.Nat),
    'symbol' : IDL.Opt(IDL.Text),
    'allocated_storage' : IDL.Opt(IDL.Nat),
  });
  const Result_15 = IDL.Variant({ 'ok' : CollectionInfo, 'err' : OrigynError });
  const ManageCollectionCommand = IDL.Variant({
    'UpdateOwner' : IDL.Principal,
    'UpdateManagers' : IDL.Vec(IDL.Principal),
    'UpdateMetadata' : IDL.Tuple(IDL.Text, IDL.Opt(CandyValue), IDL.Bool),
    'UpdateNetwork' : IDL.Opt(IDL.Principal),
    'UpdateSymbol' : IDL.Opt(IDL.Text),
    'UpdateLogo' : IDL.Opt(IDL.Text),
    'UpdateName' : IDL.Opt(IDL.Text),
  });
  const Result_14 = IDL.Variant({ 'ok' : IDL.Bool, 'err' : OrigynError });
  const LogEntry = IDL.Record({
    'data' : CandyValue,
    'event' : IDL.Text,
    'timestamp' : IDL.Int,
    'caller' : IDL.Opt(IDL.Principal),
  });
  const GetLogMessagesFilter = IDL.Record({
    'analyzeCount' : IDL.Nat32,
    'messageRegex' : IDL.Opt(IDL.Text),
    'messageContains' : IDL.Opt(IDL.Text),
  });
  const Nanos = IDL.Nat64;
  const GetLogMessagesParameters = IDL.Record({
    'count' : IDL.Nat32,
    'filter' : IDL.Opt(GetLogMessagesFilter),
    'fromTimeNanos' : IDL.Opt(Nanos),
  });
  const GetLatestLogMessagesParameters = IDL.Record({
    'upToTimeNanos' : IDL.Opt(Nanos),
    'count' : IDL.Nat32,
    'filter' : IDL.Opt(GetLogMessagesFilter),
  });
  const CanisterLogRequest = IDL.Variant({
    'getMessagesInfo' : IDL.Null,
    'getMessages' : GetLogMessagesParameters,
    'getLatestMessages' : GetLatestLogMessagesParameters,
  });
  const CanisterLogFeature = IDL.Variant({
    'filterMessageByContains' : IDL.Null,
    'filterMessageByRegex' : IDL.Null,
  });
  const CanisterLogMessagesInfo = IDL.Record({
    'features' : IDL.Vec(IDL.Opt(CanisterLogFeature)),
    'lastTimeNanos' : IDL.Opt(Nanos),
    'count' : IDL.Nat32,
    'firstTimeNanos' : IDL.Opt(Nanos),
  });
  const Data = IDL.Variant({
    'Int' : IDL.Int,
    'Nat' : IDL.Nat,
    'Empty' : IDL.Null,
    'Nat16' : IDL.Nat16,
    'Nat32' : IDL.Nat32,
    'Nat64' : IDL.Nat64,
    'Blob' : IDL.Vec(IDL.Nat8),
    'Bool' : IDL.Bool,
    'Int8' : IDL.Int8,
    'Nat8' : IDL.Nat8,
    'Nats' : IDL.Variant({
      'thawed' : IDL.Vec(IDL.Nat),
      'frozen' : IDL.Vec(IDL.Nat),
    }),
    'Text' : IDL.Text,
    'Bytes' : IDL.Variant({
      'thawed' : IDL.Vec(IDL.Nat8),
      'frozen' : IDL.Vec(IDL.Nat8),
    }),
    'Int16' : IDL.Int16,
    'Int32' : IDL.Int32,
    'Int64' : IDL.Int64,
    'Option' : IDL.Opt(CandyValue),
    'Floats' : IDL.Variant({
      'thawed' : IDL.Vec(IDL.Float64),
      'frozen' : IDL.Vec(IDL.Float64),
    }),
    'Float' : IDL.Float64,
    'Principal' : IDL.Principal,
    'Array' : IDL.Variant({
      'thawed' : IDL.Vec(CandyValue),
      'frozen' : IDL.Vec(CandyValue),
    }),
    'Class' : IDL.Vec(Property),
  });
  const Caller = IDL.Opt(IDL.Principal);
  const LogMessagesData = IDL.Record({
    'data' : Data,
    'timeNanos' : Nanos,
    'message' : IDL.Text,
    'caller' : Caller,
  });
  const CanisterLogMessages = IDL.Record({
    'data' : IDL.Vec(LogMessagesData),
    'lastAnalyzedMessageTimeNanos' : IDL.Opt(Nanos),
  });
  const CanisterLogResponse = IDL.Variant({
    'messagesInfo' : CanisterLogMessagesInfo,
    'messages' : CanisterLogMessages,
  });
  const MetricsGranularity = IDL.Variant({
    'hourly' : IDL.Null,
    'daily' : IDL.Null,
  });
  const GetMetricsParameters = IDL.Record({
    'dateToMillis' : IDL.Nat,
    'granularity' : MetricsGranularity,
    'dateFromMillis' : IDL.Nat,
  });
  const UpdateCallsAggregatedData = IDL.Vec(IDL.Nat64);
  const CanisterHeapMemoryAggregatedData = IDL.Vec(IDL.Nat64);
  const CanisterCyclesAggregatedData = IDL.Vec(IDL.Nat64);
  const CanisterMemoryAggregatedData = IDL.Vec(IDL.Nat64);
  const HourlyMetricsData = IDL.Record({
    'updateCalls' : UpdateCallsAggregatedData,
    'canisterHeapMemorySize' : CanisterHeapMemoryAggregatedData,
    'canisterCycles' : CanisterCyclesAggregatedData,
    'canisterMemorySize' : CanisterMemoryAggregatedData,
    'timeMillis' : IDL.Int,
  });
  const NumericEntity = IDL.Record({
    'avg' : IDL.Nat64,
    'max' : IDL.Nat64,
    'min' : IDL.Nat64,
    'first' : IDL.Nat64,
    'last' : IDL.Nat64,
  });
  const DailyMetricsData = IDL.Record({
    'updateCalls' : IDL.Nat64,
    'canisterHeapMemorySize' : NumericEntity,
    'canisterCycles' : NumericEntity,
    'canisterMemorySize' : NumericEntity,
    'timeMillis' : IDL.Int,
  });
  const CanisterMetricsData = IDL.Variant({
    'hourly' : IDL.Vec(HourlyMetricsData),
    'daily' : IDL.Vec(DailyMetricsData),
  });
  const CanisterMetrics = IDL.Record({ 'data' : CanisterMetricsData });
  const Result_3 = IDL.Variant({ 'ok' : IDL.Text, 'err' : OrigynError });
  const GovernanceRequest = IDL.Variant({ 'clear_shared_wallets' : IDL.Text });
  const GovernanceResponse = IDL.Variant({ 'clear_shared_wallets' : IDL.Bool });
  const Result_13 = IDL.Variant({
    'ok' : GovernanceResponse,
    'err' : OrigynError,
  });
  const Result_12 = IDL.Variant({
    'ok' : IDL.Vec(TransactionRecord),
    'err' : OrigynError,
  });
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const HttpRequest = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
  });
  const HeaderField__1 = IDL.Tuple(IDL.Text, IDL.Text);
  const StreamingCallbackToken = IDL.Record({
    'key' : IDL.Text,
    'index' : IDL.Nat,
    'content_encoding' : IDL.Text,
  });
  const StreamingStrategy = IDL.Variant({
    'Callback' : IDL.Record({
      'token' : StreamingCallbackToken,
      'callback' : IDL.Func([], [], []),
    }),
  });
  const HTTPResponse = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField__1),
    'streaming_strategy' : IDL.Opt(StreamingStrategy),
    'status_code' : IDL.Nat16,
  });
  const StreamingCallbackResponse = IDL.Record({
    'token' : IDL.Opt(StreamingCallbackToken),
    'body' : IDL.Vec(IDL.Nat8),
  });
  const ManageStorageRequest = IDL.Variant({
    'add_storage_canisters' : IDL.Vec(
      IDL.Tuple(IDL.Principal, IDL.Nat, IDL.Tuple(IDL.Nat, IDL.Nat, IDL.Nat))
    ),
  });
  const ManageStorageResponse = IDL.Variant({
    'add_storage_canisters' : IDL.Tuple(IDL.Nat, IDL.Nat),
  });
  const Result_11 = IDL.Variant({
    'ok' : ManageStorageResponse,
    'err' : OrigynError,
  });
  const SalesConfig = IDL.Record({
    'broker_id' : IDL.Opt(IDL.Principal),
    'pricing' : PricingConfig__1,
    'escrow_receipt' : IDL.Opt(EscrowReceipt),
  });
  const MarketTransferRequest = IDL.Record({
    'token_id' : IDL.Text,
    'sales_config' : SalesConfig,
  });
  const MarketTransferRequestReponse = IDL.Record({
    'token_id' : IDL.Text,
    'txn_type' : IDL.Variant({
      'escrow_deposit' : IDL.Record({
        'token' : TokenSpec,
        'token_id' : IDL.Text,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
      }),
      'canister_network_updated' : IDL.Record({
        'network' : IDL.Principal,
        'extensible' : CandyValue,
      }),
      'escrow_withdraw' : IDL.Record({
        'fee' : IDL.Nat,
        'token' : TokenSpec,
        'token_id' : IDL.Text,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
      }),
      'canister_managers_updated' : IDL.Record({
        'managers' : IDL.Vec(IDL.Principal),
        'extensible' : CandyValue,
      }),
      'auction_bid' : IDL.Record({
        'token' : TokenSpec,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
        'sale_id' : IDL.Text,
      }),
      'burn' : IDL.Null,
      'data' : IDL.Null,
      'sale_ended' : IDL.Record({
        'token' : TokenSpec,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
        'sale_id' : IDL.Opt(IDL.Text),
      }),
      'mint' : IDL.Record({
        'to' : Account__1,
        'from' : Account__1,
        'sale' : IDL.Opt(
          IDL.Record({ 'token' : TokenSpec, 'amount' : IDL.Nat })
        ),
        'extensible' : CandyValue,
      }),
      'royalty_paid' : IDL.Record({
        'tag' : IDL.Text,
        'token' : TokenSpec,
        'reciever' : Account__1,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
        'sale_id' : IDL.Opt(IDL.Text),
      }),
      'extensible' : CandyValue,
      'owner_transfer' : IDL.Record({
        'to' : Account__1,
        'from' : Account__1,
        'extensible' : CandyValue,
      }),
      'sale_opened' : IDL.Record({
        'pricing' : PricingConfig,
        'extensible' : CandyValue,
        'sale_id' : IDL.Text,
      }),
      'canister_owner_updated' : IDL.Record({
        'owner' : IDL.Principal,
        'extensible' : CandyValue,
      }),
      'sale_withdraw' : IDL.Record({
        'fee' : IDL.Nat,
        'token' : TokenSpec,
        'token_id' : IDL.Text,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
      }),
      'deposit_withdraw' : IDL.Record({
        'fee' : IDL.Nat,
        'token' : TokenSpec,
        'trx_id' : TransactionID,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
      }),
    }),
    'timestamp' : IDL.Int,
    'index' : IDL.Nat,
  });
  const Result_10 = IDL.Variant({
    'ok' : MarketTransferRequestReponse,
    'err' : OrigynError,
  });
  const Metadata = IDL.Variant({
    'fungible' : IDL.Record({
      'decimals' : IDL.Nat8,
      'metadata' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      'name' : IDL.Text,
      'symbol' : IDL.Text,
    }),
    'nonfungible' : IDL.Record({ 'metadata' : IDL.Opt(IDL.Vec(IDL.Nat8)) }),
  });
  const Result_9 = IDL.Variant({ 'ok' : Metadata, 'err' : CommonError });
  const NFTInfoStable = IDL.Record({
    'metadata' : CandyValue,
    'current_sale' : IDL.Opt(SaleStatusStable),
  });
  const Result_8 = IDL.Variant({ 'ok' : NFTInfoStable, 'err' : OrigynError });
  const NftError = IDL.Variant({
    'UnauthorizedOperator' : IDL.Null,
    'SelfTransfer' : IDL.Null,
    'TokenNotFound' : IDL.Null,
    'UnauthorizedOwner' : IDL.Null,
    'TxNotFound' : IDL.Null,
    'SelfApprove' : IDL.Null,
    'OperatorNotFound' : IDL.Null,
    'ExistedNFT' : IDL.Null,
    'OwnerNotFound' : IDL.Null,
    'Other' : IDL.Text,
  });
  const OwnerOfResponse = IDL.Variant({
    'Ok' : IDL.Opt(IDL.Principal),
    'Err' : NftError,
  });
  const BidRequest = IDL.Record({
    'broker_id' : IDL.Opt(IDL.Principal),
    'escrow_receipt' : EscrowReceipt,
    'sale_id' : IDL.Text,
  });
  const TokenSpec__1 = IDL.Variant({
    'ic' : ICTokenSpec,
    'extensible' : CandyValue,
  });
  const TransactionID__1 = IDL.Variant({
    'nat' : IDL.Nat,
    'text' : IDL.Text,
    'extensible' : CandyValue,
  });
  const DepositDetail = IDL.Record({
    'token' : TokenSpec__1,
    'trx_id' : IDL.Opt(TransactionID__1),
    'seller' : Account,
    'buyer' : Account,
    'amount' : IDL.Nat,
    'sale_id' : IDL.Opt(IDL.Text),
  });
  const EscrowRequest = IDL.Record({
    'token_id' : IDL.Text,
    'deposit' : DepositDetail,
    'lock_to_date' : IDL.Opt(IDL.Int),
  });
  const RejectDescription = IDL.Record({
    'token' : TokenSpec__1,
    'token_id' : IDL.Text,
    'seller' : Account,
    'buyer' : Account,
  });
  const WithdrawDescription = IDL.Record({
    'token' : TokenSpec__1,
    'token_id' : IDL.Text,
    'seller' : Account,
    'withdraw_to' : Account,
    'buyer' : Account,
    'amount' : IDL.Nat,
  });
  const DepositWithdrawDescription = IDL.Record({
    'token' : TokenSpec__1,
    'withdraw_to' : Account,
    'buyer' : Account,
    'amount' : IDL.Nat,
  });
  const WithdrawRequest = IDL.Variant({
    'reject' : RejectDescription,
    'sale' : WithdrawDescription,
    'deposit' : DepositWithdrawDescription,
    'escrow' : WithdrawDescription,
  });
  const DistributeSaleRequest = IDL.Record({ 'seller' : IDL.Opt(Account) });
  const ManageSaleRequest = IDL.Variant({
    'bid' : BidRequest,
    'escrow_deposit' : EscrowRequest,
    'withdraw' : WithdrawRequest,
    'end_sale' : IDL.Text,
    'refresh_offers' : IDL.Opt(Account),
    'distribute_sale' : DistributeSaleRequest,
    'open_sale' : IDL.Text,
  });
  const BidResponse = IDL.Record({
    'token_id' : IDL.Text,
    'txn_type' : IDL.Variant({
      'escrow_deposit' : IDL.Record({
        'token' : TokenSpec,
        'token_id' : IDL.Text,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
      }),
      'canister_network_updated' : IDL.Record({
        'network' : IDL.Principal,
        'extensible' : CandyValue,
      }),
      'escrow_withdraw' : IDL.Record({
        'fee' : IDL.Nat,
        'token' : TokenSpec,
        'token_id' : IDL.Text,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
      }),
      'canister_managers_updated' : IDL.Record({
        'managers' : IDL.Vec(IDL.Principal),
        'extensible' : CandyValue,
      }),
      'auction_bid' : IDL.Record({
        'token' : TokenSpec,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
        'sale_id' : IDL.Text,
      }),
      'burn' : IDL.Null,
      'data' : IDL.Null,
      'sale_ended' : IDL.Record({
        'token' : TokenSpec,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
        'sale_id' : IDL.Opt(IDL.Text),
      }),
      'mint' : IDL.Record({
        'to' : Account__1,
        'from' : Account__1,
        'sale' : IDL.Opt(
          IDL.Record({ 'token' : TokenSpec, 'amount' : IDL.Nat })
        ),
        'extensible' : CandyValue,
      }),
      'royalty_paid' : IDL.Record({
        'tag' : IDL.Text,
        'token' : TokenSpec,
        'reciever' : Account__1,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
        'sale_id' : IDL.Opt(IDL.Text),
      }),
      'extensible' : CandyValue,
      'owner_transfer' : IDL.Record({
        'to' : Account__1,
        'from' : Account__1,
        'extensible' : CandyValue,
      }),
      'sale_opened' : IDL.Record({
        'pricing' : PricingConfig,
        'extensible' : CandyValue,
        'sale_id' : IDL.Text,
      }),
      'canister_owner_updated' : IDL.Record({
        'owner' : IDL.Principal,
        'extensible' : CandyValue,
      }),
      'sale_withdraw' : IDL.Record({
        'fee' : IDL.Nat,
        'token' : TokenSpec,
        'token_id' : IDL.Text,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
      }),
      'deposit_withdraw' : IDL.Record({
        'fee' : IDL.Nat,
        'token' : TokenSpec,
        'trx_id' : TransactionID,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
      }),
    }),
    'timestamp' : IDL.Int,
    'index' : IDL.Nat,
  });
  const EscrowResponse = IDL.Record({
    'balance' : IDL.Nat,
    'receipt' : EscrowReceipt,
    'transaction' : TransactionRecord,
  });
  const WithdrawResponse = IDL.Record({
    'token_id' : IDL.Text,
    'txn_type' : IDL.Variant({
      'escrow_deposit' : IDL.Record({
        'token' : TokenSpec,
        'token_id' : IDL.Text,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
      }),
      'canister_network_updated' : IDL.Record({
        'network' : IDL.Principal,
        'extensible' : CandyValue,
      }),
      'escrow_withdraw' : IDL.Record({
        'fee' : IDL.Nat,
        'token' : TokenSpec,
        'token_id' : IDL.Text,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
      }),
      'canister_managers_updated' : IDL.Record({
        'managers' : IDL.Vec(IDL.Principal),
        'extensible' : CandyValue,
      }),
      'auction_bid' : IDL.Record({
        'token' : TokenSpec,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
        'sale_id' : IDL.Text,
      }),
      'burn' : IDL.Null,
      'data' : IDL.Null,
      'sale_ended' : IDL.Record({
        'token' : TokenSpec,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
        'sale_id' : IDL.Opt(IDL.Text),
      }),
      'mint' : IDL.Record({
        'to' : Account__1,
        'from' : Account__1,
        'sale' : IDL.Opt(
          IDL.Record({ 'token' : TokenSpec, 'amount' : IDL.Nat })
        ),
        'extensible' : CandyValue,
      }),
      'royalty_paid' : IDL.Record({
        'tag' : IDL.Text,
        'token' : TokenSpec,
        'reciever' : Account__1,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
        'sale_id' : IDL.Opt(IDL.Text),
      }),
      'extensible' : CandyValue,
      'owner_transfer' : IDL.Record({
        'to' : Account__1,
        'from' : Account__1,
        'extensible' : CandyValue,
      }),
      'sale_opened' : IDL.Record({
        'pricing' : PricingConfig,
        'extensible' : CandyValue,
        'sale_id' : IDL.Text,
      }),
      'canister_owner_updated' : IDL.Record({
        'owner' : IDL.Principal,
        'extensible' : CandyValue,
      }),
      'sale_withdraw' : IDL.Record({
        'fee' : IDL.Nat,
        'token' : TokenSpec,
        'token_id' : IDL.Text,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
      }),
      'deposit_withdraw' : IDL.Record({
        'fee' : IDL.Nat,
        'token' : TokenSpec,
        'trx_id' : TransactionID,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
      }),
    }),
    'timestamp' : IDL.Int,
    'index' : IDL.Nat,
  });
  const EndSaleResponse = IDL.Record({
    'token_id' : IDL.Text,
    'txn_type' : IDL.Variant({
      'escrow_deposit' : IDL.Record({
        'token' : TokenSpec,
        'token_id' : IDL.Text,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
      }),
      'canister_network_updated' : IDL.Record({
        'network' : IDL.Principal,
        'extensible' : CandyValue,
      }),
      'escrow_withdraw' : IDL.Record({
        'fee' : IDL.Nat,
        'token' : TokenSpec,
        'token_id' : IDL.Text,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
      }),
      'canister_managers_updated' : IDL.Record({
        'managers' : IDL.Vec(IDL.Principal),
        'extensible' : CandyValue,
      }),
      'auction_bid' : IDL.Record({
        'token' : TokenSpec,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
        'sale_id' : IDL.Text,
      }),
      'burn' : IDL.Null,
      'data' : IDL.Null,
      'sale_ended' : IDL.Record({
        'token' : TokenSpec,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
        'sale_id' : IDL.Opt(IDL.Text),
      }),
      'mint' : IDL.Record({
        'to' : Account__1,
        'from' : Account__1,
        'sale' : IDL.Opt(
          IDL.Record({ 'token' : TokenSpec, 'amount' : IDL.Nat })
        ),
        'extensible' : CandyValue,
      }),
      'royalty_paid' : IDL.Record({
        'tag' : IDL.Text,
        'token' : TokenSpec,
        'reciever' : Account__1,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
        'sale_id' : IDL.Opt(IDL.Text),
      }),
      'extensible' : CandyValue,
      'owner_transfer' : IDL.Record({
        'to' : Account__1,
        'from' : Account__1,
        'extensible' : CandyValue,
      }),
      'sale_opened' : IDL.Record({
        'pricing' : PricingConfig,
        'extensible' : CandyValue,
        'sale_id' : IDL.Text,
      }),
      'canister_owner_updated' : IDL.Record({
        'owner' : IDL.Principal,
        'extensible' : CandyValue,
      }),
      'sale_withdraw' : IDL.Record({
        'fee' : IDL.Nat,
        'token' : TokenSpec,
        'token_id' : IDL.Text,
        'trx_id' : TransactionID,
        'seller' : Account__1,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
      }),
      'deposit_withdraw' : IDL.Record({
        'fee' : IDL.Nat,
        'token' : TokenSpec,
        'trx_id' : TransactionID,
        'extensible' : CandyValue,
        'buyer' : Account__1,
        'amount' : IDL.Nat,
      }),
    }),
    'timestamp' : IDL.Int,
    'index' : IDL.Nat,
  });
  const DistributeSaleResponse = IDL.Vec(Result_6);
  const ManageSaleResponse = IDL.Variant({
    'bid' : BidResponse,
    'escrow_deposit' : EscrowResponse,
    'withdraw' : WithdrawResponse,
    'end_sale' : EndSaleResponse,
    'refresh_offers' : IDL.Vec(EscrowRecord),
    'distribute_sale' : DistributeSaleResponse,
    'open_sale' : IDL.Bool,
  });
  Result_6.fill(
    IDL.Variant({ 'ok' : ManageSaleResponse, 'err' : OrigynError })
  );
  const SaleInfoRequest = IDL.Variant({
    'status' : IDL.Text,
    'active' : IDL.Opt(IDL.Tuple(IDL.Nat, IDL.Nat)),
    'deposit_info' : IDL.Opt(Account),
    'history' : IDL.Opt(IDL.Tuple(IDL.Nat, IDL.Nat)),
  });
  const SubAccountInfo = IDL.Record({
    'account_id' : IDL.Vec(IDL.Nat8),
    'principal' : IDL.Principal,
    'account_id_text' : IDL.Text,
    'account' : IDL.Record({
      'principal' : IDL.Principal,
      'sub_account' : IDL.Vec(IDL.Nat8),
    }),
  });
  const SaleInfoResponse = IDL.Variant({
    'status' : IDL.Opt(SaleStatusStable),
    'active' : IDL.Record({
      'eof' : IDL.Bool,
      'records' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Opt(SaleStatusStable))),
      'count' : IDL.Nat,
    }),
    'deposit_info' : SubAccountInfo,
    'history' : IDL.Record({
      'eof' : IDL.Bool,
      'records' : IDL.Vec(IDL.Opt(SaleStatusStable)),
      'count' : IDL.Nat,
    }),
  });
  const Result_7 = IDL.Variant({
    'ok' : SaleInfoResponse,
    'err' : OrigynError,
  });
  const ShareWalletRequest = IDL.Record({
    'to' : Account,
    'token_id' : IDL.Text,
    'from' : Account,
  });
  const OwnerTransferResponse = IDL.Record({
    'transaction' : TransactionRecord,
    'assets' : IDL.Vec(CandyValue),
  });
  const Result_5 = IDL.Variant({
    'ok' : OwnerTransferResponse,
    'err' : OrigynError,
  });
  const StageChunkArg = IDL.Record({
    'content' : IDL.Vec(IDL.Nat8),
    'token_id' : IDL.Text,
    'chunk' : IDL.Nat,
    'filedata' : CandyValue,
    'library_id' : IDL.Text,
  });
  const StageLibraryResponse = IDL.Record({ 'canister' : IDL.Principal });
  const Result_4 = IDL.Variant({
    'ok' : StageLibraryResponse,
    'err' : OrigynError,
  });
  const StateSize = IDL.Record({
    'sales_balances' : IDL.Nat,
    'offers' : IDL.Nat,
    'nft_ledgers' : IDL.Nat,
    'allocations' : IDL.Nat,
    'nft_sales' : IDL.Nat,
    'buckets' : IDL.Nat,
    'escrow_balances' : IDL.Nat,
  });
  const StorageMetrics = IDL.Record({
    'available_space' : IDL.Nat,
    'allocations' : IDL.Vec(AllocationRecordStable),
    'allocated_storage' : IDL.Nat,
  });
  const Result_2 = IDL.Variant({ 'ok' : StorageMetrics, 'err' : OrigynError });
  const EXTTokensResult = IDL.Tuple(
    IDL.Nat32,
    IDL.Opt(
      IDL.Record({
        'locked' : IDL.Opt(IDL.Int),
        'seller' : IDL.Principal,
        'price' : IDL.Nat64,
      })
    ),
    IDL.Opt(IDL.Vec(IDL.Nat8)),
  );
  const Result_1 = IDL.Variant({
    'ok' : IDL.Vec(EXTTokensResult),
    'err' : CommonError,
  });
  const Memo = IDL.Vec(IDL.Nat8);
  const SubAccount = IDL.Vec(IDL.Nat8);
  const TransferRequest = IDL.Record({
    'to' : User,
    'token' : TokenIdentifier,
    'notify' : IDL.Bool,
    'from' : User,
    'memo' : Memo,
    'subaccount' : IDL.Opt(SubAccount),
    'amount' : Balance,
  });
  const TransferResponse = IDL.Variant({
    'ok' : Balance,
    'err' : IDL.Variant({
      'CannotNotify' : AccountIdentifier,
      'InsufficientBalance' : IDL.Null,
      'InvalidToken' : TokenIdentifier,
      'Rejected' : IDL.Null,
      'Unauthorized' : AccountIdentifier,
      'Other' : IDL.Text,
    }),
  });
  const Result__1 = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : NftError });
  const UpdateMode = IDL.Variant({
    'Set' : CandyValue,
    'Lock' : CandyValue,
    'Next' : IDL.Vec(Update),
  });
  Update.fill(IDL.Record({ 'mode' : UpdateMode, 'name' : IDL.Text }));
  const UpdateRequest = IDL.Record({
    'id' : IDL.Text,
    'update' : IDL.Vec(Update),
  });
  const NFTUpdateRequest = IDL.Variant({
    'update' : IDL.Record({
      'token_id' : IDL.Text,
      'update' : UpdateRequest,
      'app_id' : IDL.Text,
    }),
    'replace' : IDL.Record({ 'token_id' : IDL.Text, 'data' : CandyValue }),
  });
  const NFTUpdateResponse = IDL.Bool;
  const Result = IDL.Variant({ 'ok' : NFTUpdateResponse, 'err' : OrigynError });
  const Nft_Canister = IDL.Service({
    '__advance_time' : IDL.Func([IDL.Int], [IDL.Int], []),
    '__set_time_mode' : IDL.Func(
        [IDL.Variant({ 'test' : IDL.Null, 'standard' : IDL.Null })],
        [IDL.Bool],
        [],
      ),
    '__supports' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
        ['query'],
      ),
    'back_up' : IDL.Func(
        [IDL.Nat],
        [IDL.Variant({ 'eof' : NFTBackupChunk, 'data' : NFTBackupChunk })],
        ['query'],
      ),
    'balance' : IDL.Func([BalanceRequest], [BalanceResponse__1], ['query']),
    'balanceEXT' : IDL.Func([BalanceRequest], [BalanceResponse__1], ['query']),
    'balanceOfDip721' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'balance_of_nft_origyn' : IDL.Func([Account], [Result_19], ['query']),
    'balance_of_secure_nft_origyn' : IDL.Func([Account], [Result_19], []),
    'bearer' : IDL.Func([TokenIdentifier], [Result_18], ['query']),
    'bearerEXT' : IDL.Func([TokenIdentifier], [Result_18], ['query']),
    'bearer_batch_nft_origyn' : IDL.Func(
        [IDL.Vec(IDL.Text)],
        [IDL.Vec(Result_17)],
        ['query'],
      ),
    'bearer_batch_secure_nft_origyn' : IDL.Func(
        [IDL.Vec(IDL.Text)],
        [IDL.Vec(Result_17)],
        [],
      ),
    'bearer_nft_origyn' : IDL.Func([IDL.Text], [Result_17], ['query']),
    'bearer_secure_nft_origyn' : IDL.Func([IDL.Text], [Result_17], []),
    'canister_status' : IDL.Func(
        [IDL.Record({ 'canister_id' : canister_id })],
        [canister_status],
        [],
      ),
    'chunk_nft_origyn' : IDL.Func([ChunkRequest], [Result_16], ['query']),
    'chunk_secure_nft_origyn' : IDL.Func([ChunkRequest], [Result_16], []),
    'collectCanisterMetrics' : IDL.Func([], [], ['query']),
    'collection_nft_origyn' : IDL.Func(
        [
          IDL.Opt(
            IDL.Vec(IDL.Tuple(IDL.Text, IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)))
          ),
        ],
        [Result_15],
        ['query'],
      ),
    'collection_secure_nft_origyn' : IDL.Func(
        [
          IDL.Opt(
            IDL.Vec(IDL.Tuple(IDL.Text, IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)))
          ),
        ],
        [Result_15],
        [],
      ),
    'collection_update_batch_nft_origyn' : IDL.Func(
        [IDL.Vec(ManageCollectionCommand)],
        [IDL.Vec(Result_14)],
        [],
      ),
    'collection_update_nft_origyn' : IDL.Func(
        [ManageCollectionCommand],
        [Result_14],
        [],
      ),
    'current_log' : IDL.Func([], [IDL.Vec(LogEntry)], ['query']),
    'cycles' : IDL.Func([], [IDL.Nat], ['query']),
    'getCanisterLog' : IDL.Func(
        [IDL.Opt(CanisterLogRequest)],
        [IDL.Opt(CanisterLogResponse)],
        ['query'],
      ),
    'getCanisterMetrics' : IDL.Func(
        [GetMetricsParameters],
        [IDL.Opt(CanisterMetrics)],
        ['query'],
      ),
    'getEXTTokenIdentifier' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'get_access_key' : IDL.Func([], [Result_3], ['query']),
    'get_halt' : IDL.Func([], [IDL.Bool], ['query']),
    'get_nat_as_token_id_origyn' : IDL.Func([IDL.Nat], [IDL.Text], ['query']),
    'get_token_id_as_nat_origyn' : IDL.Func([IDL.Text], [IDL.Nat], ['query']),
    'governance_nft_origyn' : IDL.Func([GovernanceRequest], [Result_13], []),
    'harvest_log' : IDL.Func([IDL.Nat], [IDL.Vec(IDL.Vec(LogEntry))], []),
    'history_batch_nft_origyn' : IDL.Func(
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)))],
        [IDL.Vec(Result_12)],
        ['query'],
      ),
    'history_batch_secure_nft_origyn' : IDL.Func(
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)))],
        [IDL.Vec(Result_12)],
        [],
      ),
    'history_nft_origyn' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
        [Result_12],
        ['query'],
      ),
    'history_secure_nft_origyn' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat)],
        [Result_12],
        [],
      ),
    'http_access_key' : IDL.Func([], [Result_3], []),
    'http_request' : IDL.Func([HttpRequest], [HTTPResponse], ['query']),
    'http_request_streaming_callback' : IDL.Func(
        [StreamingCallbackToken],
        [StreamingCallbackResponse],
        ['query'],
      ),
    'log_history_page' : IDL.Func([IDL.Nat], [IDL.Vec(LogEntry)], ['query']),
    'log_history_page_chunk' : IDL.Func(
        [IDL.Nat, IDL.Nat, IDL.Nat],
        [IDL.Vec(LogEntry)],
        ['query'],
      ),
    'log_history_size' : IDL.Func([], [IDL.Nat], ['query']),
    'manage_storage_nft_origyn' : IDL.Func(
        [ManageStorageRequest],
        [Result_11],
        [],
      ),
    'market_transfer_batch_nft_origyn' : IDL.Func(
        [IDL.Vec(MarketTransferRequest)],
        [IDL.Vec(Result_10)],
        [],
      ),
    'market_transfer_nft_origyn' : IDL.Func(
        [MarketTransferRequest],
        [Result_10],
        [],
      ),
    'metadata' : IDL.Func([TokenIdentifier], [Result_9], ['query']),
    'mint_batch_nft_origyn' : IDL.Func(
        [IDL.Vec(IDL.Tuple(IDL.Text, Account))],
        [IDL.Vec(Result_3)],
        [],
      ),
    'mint_nft_origyn' : IDL.Func([IDL.Text, Account], [Result_3], []),
    'nftStreamingCallback' : IDL.Func(
        [StreamingCallbackToken],
        [StreamingCallbackResponse],
        ['query'],
      ),
    'nft_batch_origyn' : IDL.Func(
        [IDL.Vec(IDL.Text)],
        [IDL.Vec(Result_8)],
        ['query'],
      ),
    'nft_batch_secure_origyn' : IDL.Func(
        [IDL.Vec(IDL.Text)],
        [IDL.Vec(Result_8)],
        [],
      ),
    'nft_origyn' : IDL.Func([IDL.Text], [Result_8], ['query']),
    'nft_secure_origyn' : IDL.Func([IDL.Text], [Result_8], []),
    'nuke_log' : IDL.Func([], [], []),
    'ownerOf' : IDL.Func([IDL.Nat], [OwnerOfResponse], ['query']),
    'ownerOfDIP721' : IDL.Func([IDL.Nat], [OwnerOfResponse], ['query']),
    'sale_batch_nft_origyn' : IDL.Func(
        [IDL.Vec(ManageSaleRequest)],
        [IDL.Vec(Result_6)],
        [],
      ),
    'sale_info_batch_nft_origyn' : IDL.Func(
        [IDL.Vec(SaleInfoRequest)],
        [IDL.Vec(Result_7)],
        ['query'],
      ),
    'sale_info_batch_secure_nft_origyn' : IDL.Func(
        [IDL.Vec(SaleInfoRequest)],
        [IDL.Vec(Result_7)],
        [],
      ),
    'sale_info_nft_origyn' : IDL.Func([SaleInfoRequest], [Result_7], ['query']),
    'sale_info_secure_nft_origyn' : IDL.Func([SaleInfoRequest], [Result_7], []),
    'sale_nft_origyn' : IDL.Func([ManageSaleRequest], [Result_6], []),
    'set_data_harvester' : IDL.Func([IDL.Nat], [], []),
    'set_halt' : IDL.Func([IDL.Bool], [], []),
    'set_log_harvester_id' : IDL.Func([IDL.Principal], [], []),
    'share_wallet_nft_origyn' : IDL.Func([ShareWalletRequest], [Result_5], []),
    'stage_batch_nft_origyn' : IDL.Func(
        [IDL.Vec(IDL.Record({ 'metadata' : CandyValue }))],
        [IDL.Vec(Result_3)],
        [],
      ),
    'stage_library_batch_nft_origyn' : IDL.Func(
        [IDL.Vec(StageChunkArg)],
        [IDL.Vec(Result_4)],
        [],
      ),
    'stage_library_nft_origyn' : IDL.Func([StageChunkArg], [Result_4], []),
    'stage_nft_origyn' : IDL.Func(
        [IDL.Record({ 'metadata' : CandyValue })],
        [Result_3],
        [],
      ),
    'state_size' : IDL.Func([], [StateSize], ['query']),
    'storage_info_nft_origyn' : IDL.Func([], [Result_2], ['query']),
    'storage_info_secure_nft_origyn' : IDL.Func([], [Result_2], []),
    'tokens_ext' : IDL.Func([IDL.Text], [Result_1], ['query']),
    'transfer' : IDL.Func([TransferRequest], [TransferResponse], []),
    'transferDip721' : IDL.Func([IDL.Principal, IDL.Nat], [Result__1], []),
    'transferEXT' : IDL.Func([TransferRequest], [TransferResponse], []),
    'transferFrom' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat],
        [Result__1],
        [],
      ),
    'transferFromDip721' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat],
        [Result__1],
        [],
      ),
    'update_app_nft_origyn' : IDL.Func([NFTUpdateRequest], [Result], []),
    'wallet_receive' : IDL.Func([], [IDL.Nat], []),
    'whoami' : IDL.Func([], [IDL.Principal], ['query']),
  });
  return Nft_Canister;
};
export const init = ({ IDL }) => {
  const Principal = IDL.Principal;
  const InitArgs = IDL.Record({
    'owner' : Principal,
    'storage_space' : IDL.Opt(IDL.Nat),
  });
  return [InitArgs];
};
