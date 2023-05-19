export const idlFactory = ({ IDL }) => {
  const Property = IDL.Rec()
  const Query = IDL.Rec()
  const Update = IDL.Rec()
  const Callback = IDL.Func([], [], [])
  const StagedWrite = IDL.Variant({
    Init: IDL.Record({ size: IDL.Nat, callback: IDL.Opt(Callback) }),
    Chunk: IDL.Record({
      chunk: IDL.Vec(IDL.Nat8),
      callback: IDL.Opt(Callback),
    }),
  })
  const AssetRequest = IDL.Variant({
    Put: IDL.Record({
      key: IDL.Text,
      contentType: IDL.Text,
      callback: IDL.Opt(Callback),
      payload: IDL.Variant({
        StagedData: IDL.Null,
        Payload: IDL.Vec(IDL.Nat8),
      }),
    }),
    Remove: IDL.Record({ key: IDL.Text, callback: IDL.Opt(Callback) }),
    StagedWrite: StagedWrite,
  })
  const AuthorizeRequest = IDL.Record({
    p: IDL.Principal,
    id: IDL.Text,
    isAuthorized: IDL.Bool,
  })
  const Error = IDL.Variant({
    Immutable: IDL.Null,
    NotFound: IDL.Null,
    Unauthorized: IDL.Null,
    InvalidRequest: IDL.Null,
    AuthorizedPrincipalLimitReached: IDL.Nat,
  })
  const Result_1 = IDL.Variant({ ok: IDL.Null, err: Error })
  const ContractInfo = IDL.Record({
    nft_payload_size: IDL.Nat,
    memory_size: IDL.Nat,
    max_live_size: IDL.Nat,
    cycles: IDL.Nat,
    total_minted: IDL.Nat,
    heap_size: IDL.Nat,
    authorized_users: IDL.Vec(IDL.Principal),
  })
  const TopupCallback = IDL.Func([], [], [])
  const Contract = IDL.Variant({
    ContractAuthorize: IDL.Record({
      isAuthorized: IDL.Bool,
      user: IDL.Principal,
    }),
    Mint: IDL.Record({ id: IDL.Text, owner: IDL.Principal }),
  })
  const Token = IDL.Variant({
    Authorize: IDL.Record({
      id: IDL.Text,
      isAuthorized: IDL.Bool,
      user: IDL.Principal,
    }),
    Transfer: IDL.Record({
      id: IDL.Text,
      to: IDL.Principal,
      from: IDL.Principal,
    }),
  })
  const Message = IDL.Record({
    topupCallback: TopupCallback,
    createdAt: IDL.Int,
    topupAmount: IDL.Nat,
    event: IDL.Variant({ ContractEvent: Contract, TokenEvent: Token }),
  })
  const Callback__1 = IDL.Func([Message], [], [])
  const CallbackStatus = IDL.Record({
    failedCalls: IDL.Nat,
    failedCallsLimit: IDL.Nat,
    callback: IDL.Opt(Callback__1),
    noTopupCallLimit: IDL.Nat,
    callsSinceLastTopup: IDL.Nat,
  })
  const ContractMetadata = IDL.Record({
    name: IDL.Text,
    symbol: IDL.Text,
  })
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text)
  const Request = IDL.Record({
    url: IDL.Text,
    method: IDL.Text,
    body: IDL.Vec(IDL.Nat8),
    headers: IDL.Vec(HeaderField),
  })
  const StreamingCallbackToken = IDL.Record({
    key: IDL.Text,
    index: IDL.Nat,
    content_encoding: IDL.Text,
  })
  const StreamingCallbackResponse = IDL.Record({
    token: IDL.Opt(StreamingCallbackToken),
    body: IDL.Vec(IDL.Nat8),
  })
  const StreamingCallback = IDL.Func([StreamingCallbackToken], [StreamingCallbackResponse], ["query"])
  const StreamingStrategy = IDL.Variant({
    Callback: IDL.Record({
      token: StreamingCallbackToken,
      callback: StreamingCallback,
    }),
  })
  const Response = IDL.Record({
    body: IDL.Vec(IDL.Nat8),
    headers: IDL.Vec(HeaderField),
    streaming_strategy: IDL.Opt(StreamingStrategy),
    status_code: IDL.Nat16,
  })
  const Value = IDL.Variant({
    Int: IDL.Int,
    Nat: IDL.Nat,
    Empty: IDL.Null,
    Bool: IDL.Bool,
    Text: IDL.Text,
    Float: IDL.Float64,
    Principal: IDL.Principal,
    Class: IDL.Vec(Property),
  })
  Property.fill(IDL.Record({ value: Value, name: IDL.Text, immutable: IDL.Bool }))
  const Properties = IDL.Vec(Property)
  const Egg = IDL.Record({
    contentType: IDL.Text,
    owner: IDL.Opt(IDL.Principal),
    properties: Properties,
    isPrivate: IDL.Bool,
    payload: IDL.Variant({
      StagedData: IDL.Null,
      Payload: IDL.Vec(IDL.Nat8),
    }),
  })
  const Result_5 = IDL.Variant({ ok: IDL.Principal, err: Error })
  Query.fill(IDL.Record({ name: IDL.Text, next: IDL.Vec(Query) }))
  const QueryMode = IDL.Variant({ All: IDL.Null, Some: IDL.Vec(Query) })
  const QueryRequest = IDL.Record({ id: IDL.Text, mode: QueryMode })
  const Result = IDL.Variant({ ok: Properties, err: Error })
  const Chunk = IDL.Record({
    data: IDL.Vec(IDL.Nat8),
    totalPages: IDL.Nat,
    nextPage: IDL.Opt(IDL.Nat),
  })
  const PayloadResult = IDL.Variant({
    Complete: IDL.Vec(IDL.Nat8),
    Chunk: Chunk,
  })
  const PublicToken = IDL.Record({
    id: IDL.Text,
    contentType: IDL.Text,
    owner: IDL.Principal,
    createdAt: IDL.Int,
    properties: Properties,
    payload: PayloadResult,
  })
  const Result_4 = IDL.Variant({ ok: PublicToken, err: Error })
  const Result_3 = IDL.Variant({ ok: Chunk, err: Error })
  const Metadata = IDL.Record({
    id: IDL.Text,
    contentType: IDL.Text,
    owner: IDL.Principal,
    createdAt: IDL.Int,
    properties: Properties,
  })
  const Result_2 = IDL.Variant({ ok: Metadata, err: Error })
  const UpdateEventCallback = IDL.Variant({
    Set: Callback__1,
    Remove: IDL.Null,
  })
  const UpdateMode = IDL.Variant({ Set: Value, Next: IDL.Vec(Update) })
  Update.fill(IDL.Record({ mode: UpdateMode, name: IDL.Text }))
  const UpdateRequest = IDL.Record({
    id: IDL.Text,
    update: IDL.Vec(Update),
  })
  const Hub = IDL.Service({
    assetRequest: IDL.Func([AssetRequest], [], []),
    authorize: IDL.Func([AuthorizeRequest], [Result_1], []),
    balanceOf: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Text)], []),
    getAuthorized: IDL.Func([IDL.Text], [IDL.Vec(IDL.Principal)], ["query"]),
    getContractInfo: IDL.Func([], [ContractInfo], []),
    getEventCallbackStatus: IDL.Func([], [CallbackStatus], []),
    getMetadata: IDL.Func([], [ContractMetadata], ["query"]),
    getTotalMinted: IDL.Func([], [IDL.Nat], ["query"]),
    http_request: IDL.Func([Request], [Response], ["query"]),
    http_request_streaming_callback: IDL.Func([StreamingCallbackToken], [StreamingCallbackResponse], ["query"]),
    init: IDL.Func([IDL.Vec(IDL.Principal), ContractMetadata], [], []),
    isAuthorized: IDL.Func([IDL.Text, IDL.Principal], [IDL.Bool], ["query"]),
    listAssets: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text, IDL.Nat))], ["query"]),
    mint: IDL.Func([Egg], [IDL.Text], []),
    nftStreamingCallback: IDL.Func([StreamingCallbackToken], [StreamingCallbackResponse], ["query"]),
    ownerOf: IDL.Func([IDL.Text], [Result_5], ["query"]),
    queryProperties: IDL.Func([QueryRequest], [Result], ["query"]),
    staticStreamingCallback: IDL.Func([StreamingCallbackToken], [StreamingCallbackResponse], ["query"]),
    tokenByIndex: IDL.Func([IDL.Text], [Result_4], []),
    tokenChunkByIndex: IDL.Func([IDL.Text, IDL.Nat], [Result_3], []),
    tokenMetadataByIndex: IDL.Func([IDL.Text], [Result_2], []),
    transfer: IDL.Func([IDL.Principal, IDL.Text], [Result_1], []),
    updateContractOwners: IDL.Func([IDL.Principal, IDL.Bool], [Result_1], []),
    updateEventCallback: IDL.Func([UpdateEventCallback], [], []),
    updateProperties: IDL.Func([UpdateRequest], [Result], []),
    wallet_receive: IDL.Func([], [], []),
    writeStaged: IDL.Func([StagedWrite], [], []),
  })
  return Hub
};
export const init = ({}) => {
  return []
}
