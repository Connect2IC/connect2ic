import type { Principal } from "@dfinity/principal"

export type AssetRequest =
  | {
  Put: {
    key: string;
    contentType: string;
    callback: [] | [Callback];
    payload: { StagedData: null } | { Payload: Array<number> };
  };
}
  | { Remove: { key: string; callback: [] | [Callback] } }
  | { StagedWrite: StagedWrite };

export interface AuthorizeRequest {
  p: Principal;
  id: string;
  isAuthorized: boolean;
}

export type Callback = () => Promise<undefined>;

export interface CallbackStatus {
  failedCalls: bigint;
  failedCallsLimit: bigint;
  callback: [] | [Callback__1];
  noTopupCallLimit: bigint;
  callsSinceLastTopup: bigint;
}

export type Callback__1 = (arg_0: Message) => Promise<undefined>;

export interface Chunk {
  data: Array<number>;
  totalPages: bigint;
  nextPage: [] | [bigint];
}

export type Contract =
  | {
  ContractAuthorize: { isAuthorized: boolean; user: Principal };
}
  | { Mint: { id: string; owner: Principal } };

export interface ContractInfo {
  nft_payload_size: bigint;
  memory_size: bigint;
  max_live_size: bigint;
  cycles: bigint;
  total_minted: bigint;
  heap_size: bigint;
  authorized_users: Array<Principal>;
}

export interface ContractMetadata {
  name: string;
  symbol: string;
}

export interface Egg {
  contentType: string;
  owner: [] | [Principal];
  properties: Properties;
  isPrivate: boolean;
  payload: { StagedData: null } | { Payload: Array<number> };
}

export type Error =
  | { Immutable: null }
  | { NotFound: null }
  | { Unauthorized: null }
  | { InvalidRequest: null }
  | { AuthorizedPrincipalLimitReached: bigint };
export type HeaderField = [string, string];

export interface Hub {
  assetRequest: (arg_0: AssetRequest) => Promise<undefined>;
  authorize: (arg_0: AuthorizeRequest) => Promise<Result_1>;
  balanceOf: (arg_0: Principal) => Promise<Array<string>>;
  getAuthorized: (arg_0: string) => Promise<Array<Principal>>;
  getContractInfo: () => Promise<ContractInfo>;
  getEventCallbackStatus: () => Promise<CallbackStatus>;
  getMetadata: () => Promise<ContractMetadata>;
  getTotalMinted: () => Promise<bigint>;
  http_request: (arg_0: Request) => Promise<Response>;
  http_request_streaming_callback: (arg_0: StreamingCallbackToken) => Promise<StreamingCallbackResponse>;
  init: (arg_0: Array<Principal>, arg_1: ContractMetadata) => Promise<undefined>;
  isAuthorized: (arg_0: string, arg_1: Principal) => Promise<boolean>;
  listAssets: () => Promise<Array<[string, string, bigint]>>;
  mint: (arg_0: Egg) => Promise<string>;
  nftStreamingCallback: (arg_0: StreamingCallbackToken) => Promise<StreamingCallbackResponse>;
  ownerOf: (arg_0: string) => Promise<Result_5>;
  queryProperties: (arg_0: QueryRequest) => Promise<Result>;
  staticStreamingCallback: (arg_0: StreamingCallbackToken) => Promise<StreamingCallbackResponse>;
  tokenByIndex: (arg_0: string) => Promise<Result_4>;
  tokenChunkByIndex: (arg_0: string, arg_1: bigint) => Promise<Result_3>;
  tokenMetadataByIndex: (arg_0: string) => Promise<Result_2>;
  transfer: (arg_0: Principal, arg_1: string) => Promise<Result_1>;
  updateContractOwners: (arg_0: Principal, arg_1: boolean) => Promise<Result_1>;
  updateEventCallback: (arg_0: UpdateEventCallback) => Promise<undefined>;
  updateProperties: (arg_0: UpdateRequest) => Promise<Result>;
  wallet_receive: () => Promise<undefined>;
  writeStaged: (arg_0: StagedWrite) => Promise<undefined>;
}

export interface Message {
  topupCallback: TopupCallback;
  createdAt: bigint;
  topupAmount: bigint;
  event: { ContractEvent: Contract } | { TokenEvent: Token };
}

export interface Metadata {
  id: string;
  contentType: string;
  owner: Principal;
  createdAt: bigint;
  properties: Properties;
}

export type PayloadResult = { Complete: Array<number> } | { Chunk: Chunk };
export type Properties = Array<Property>;

export interface Property {
  value: Value;
  name: string;
  immutable: boolean;
}

export interface PublicToken {
  id: string;
  contentType: string;
  owner: Principal;
  createdAt: bigint;
  properties: Properties;
  payload: PayloadResult;
}

export interface Query {
  name: string;
  next: Array<Query>;
}

export type QueryMode = { All: null } | { Some: Array<Query> };

export interface QueryRequest {
  id: string;
  mode: QueryMode;
}

export interface Request {
  url: string;
  method: string;
  body: Array<number>;
  headers: Array<HeaderField>;
}

export interface Response {
  body: Array<number>;
  headers: Array<HeaderField>;
  streaming_strategy: [] | [StreamingStrategy];
  status_code: number;
}

export type Result = { ok: Properties } | { err: Error };
export type Result_1 = { ok: null } | { err: Error };
export type Result_2 = { ok: Metadata } | { err: Error };
export type Result_3 = { ok: Chunk } | { err: Error };
export type Result_4 = { ok: PublicToken } | { err: Error };
export type Result_5 = { ok: Principal } | { err: Error };
export type StagedWrite =
  | {
  Init: { size: bigint; callback: [] | [Callback] };
}
  | { Chunk: { chunk: Array<number>; callback: [] | [Callback] } };
export type StreamingCallback = (arg_0: StreamingCallbackToken) => Promise<StreamingCallbackResponse>;

export interface StreamingCallbackResponse {
  token: [] | [StreamingCallbackToken];
  body: Array<number>;
}

export interface StreamingCallbackToken {
  key: string;
  index: bigint;
  content_encoding: string;
}

export type StreamingStrategy = {
  Callback: {
    token: StreamingCallbackToken;
    callback: StreamingCallback;
  };
};
export type Token =
  | {
  Authorize: {
    id: string;
    isAuthorized: boolean;
    user: Principal;
  };
}
  | { Transfer: { id: string; to: Principal; from: Principal } };
export type TopupCallback = () => Promise<undefined>;

export interface Update {
  mode: UpdateMode;
  name: string;
}

export type UpdateEventCallback = { Set: Callback__1 } | { Remove: null };
export type UpdateMode = { Set: Value } | { Next: Array<Update> };

export interface UpdateRequest {
  id: string;
  update: Array<Update>;
}

export type Value =
  | { Int: bigint }
  | { Nat: bigint }
  | { Empty: null }
  | { Bool: boolean }
  | { Text: string }
  | { Float: number }
  | { Principal: Principal }
  | { Class: Array<Property> };
export default interface _SERVICE extends Hub {
}
