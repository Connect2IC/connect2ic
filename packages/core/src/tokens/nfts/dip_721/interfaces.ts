import type { Principal } from "@dfinity/principal"

export type AccountIdentifier = string;
export type AccountIdentifierReturn = { Ok: AccountIdentifier } | { Err: CommonError };
export type ApiError = { ZeroAddress: null } | { InvalidTokenId: null } | { Unauthorized: null } | { Other: null };
export type Balance = bigint;
export type BalanceReturn = { Ok: Balance } | { Err: CommonError };
export type CommonError = { InvalidToken: TokenIdentifier } | { Other: string };
export type Date = bigint;

export interface ExtendedMetadataResult {
  token_id: bigint;
  metadata_desc: MetadataDesc;
}

export type InterfaceId =
  { Burn: null }
  | { Mint: null }
  | { Approval: null }
  | { TransactionHistory: null }
  | { TransferNotification: null };

export interface LogoResult {
  data: string;
  logo_type: string;
}

export type Memo = Array<number>;
export type Metadata =
  | {
  fungible: {
    decimals: number;
    metadata: [] | [MetadataContainer];
    name: string;
    symbol: string;
  };
}
  | { nonfungible: [] | [MetadataContainer] };
export type MetadataContainer = { blob: Array<number> } | { data: Array<MetadataValue> } | { json: string };
export type MetadataDesc = Array<MetadataPart>;

export interface MetadataKeyVal {
  key: string;
  val: MetadataVal;
}

export interface MetadataPart {
  data: Array<number>;
  key_val_data: Array<MetadataKeyVal>;
  purpose: MetadataPurpose;
}

export type MetadataPurpose = { Preview: null } | { Rendered: null };
export type MetadataResult = { Ok: MetadataDesc } | { Err: ApiError };
export type MetadataReturn = { Ok: Metadata } | { Err: CommonError };
export type MetadataVal =
  | { Nat64Content: bigint }
  | { Nat32Content: number }
  | { Nat8Content: number }
  | { NatContent: bigint }
  | { Nat16Content: number }
  | { BlobContent: Array<number> }
  | { TextContent: string };
export type MetadataValue = [string, Value];
export type MintReceipt = { Ok: MintReceiptPart } | { Err: ApiError };

export interface MintReceiptPart {
  id: bigint;
  token_id: bigint;
}

export interface MintRequest {
  to: User;
  metadata: [] | [MetadataContainer];
}

export type OwnerResult = { Ok: Principal } | { Err: ApiError };
export type SubAccount = Array<number>;
export type TokenIdentifier = string;
export type TokenIndex = number;

export interface TokenMetadata {
  principal: Principal;
  metadata: Metadata;
  account_identifier: AccountIdentifier;
  token_identifier: TokenIdentifier;
}

export interface Transaction {
  date: Date;
  request: TransferRequest;
  txid: TransactionId;
}

export type TransactionId = bigint;

export interface TransactionRequest {
  token: TokenIdentifier;
  query: TransactionRequestFilter;
}

export type TransactionRequestFilter =
  { date: [Date, Date] }
  | { page: [bigint, bigint] }
  | { txid: TransactionId }
  | { user: User };

export interface TransactionResult {
  fee: bigint;
  transaction_type: TransactionType;
}

export type TransactionType =
  | {
  Approve: { to: Principal; token_id: bigint; from: Principal };
}
  | { Burn: { token_id: bigint } }
  | { Mint: { to: Principal; token_id: bigint } }
  | { SetApprovalForAll: { to: Principal; from: Principal } }
  | {
  Transfer: { to: Principal; token_id: bigint; from: Principal };
}
  | {
  TransferFrom: {
    to: Principal;
    token_id: bigint;
    from: Principal;
  };
};

export interface TransferRequest {
  to: User;
  token: TokenIdentifier;
  notify: boolean;
  from: User;
  memo: Memo;
  subaccount: [] | [SubAccount];
  amount: Balance;
}

export type TransferResponse =
  | { Ok: Balance }
  | {
  Err:
    | { CannotNotify: AccountIdentifier }
    | { InsufficientBalance: null }
    | { InvalidToken: TokenIdentifier }
    | { Rejected: null }
    | { Unauthorized: AccountIdentifier }
    | { Other: string };
};
export type TrasactionsResult = { Ok: Array<Transaction> } | { Err: CommonError };
export type TxReceipt = { Ok: bigint } | { Err: ApiError };
export type User = { principal: Principal } | { address: AccountIdentifier };
export type Value = { nat: bigint } | { blob: Array<number> } | { nat8: number } | { text: string };

export interface erc721_token {
  add: (arg_0: TransferRequest) => Promise<TransactionId>;
  balanceOfDip721: (arg_0: Principal) => Promise<bigint>;
  bearer: (arg_0: TokenIdentifier) => Promise<AccountIdentifierReturn>;
  getAllMetadataForUser: (arg_0: User) => Promise<Array<TokenMetadata>>;
  getMaxLimitDip721: () => Promise<number>;
  getMetadataDip721: (arg_0: bigint) => Promise<MetadataResult>;
  getMetadataForUserDip721: (arg_0: Principal) => Promise<Array<ExtendedMetadataResult>>;
  getTokenIdsForUserDip721: (arg_0: Principal) => Promise<Array<bigint>>;
  logoDip721: () => Promise<LogoResult>;
  metadata: (arg_0: TokenIdentifier) => Promise<MetadataReturn>;
  mintDip721: (arg_0: Principal, arg_1: MetadataDesc) => Promise<MintReceipt>;
  mintNFT: (arg_0: MintRequest) => Promise<TokenIdentifier>;
  nameDip721: () => Promise<string>;
  ownerOfDip721: (arg_0: bigint) => Promise<OwnerResult>;
  safeTransferFromDip721: (arg_0: Principal, arg_1: Principal, arg_2: bigint) => Promise<TxReceipt>;
  supply: (arg_0: TokenIdentifier) => Promise<BalanceReturn>;
  supportedInterfacesDip721: () => Promise<Array<InterfaceId>>;
  symbolDip721: () => Promise<string>;
  totalSupplyDip721: () => Promise<bigint>;
  transfer: (arg_0: TransferRequest) => Promise<TransferResponse>;
  transferFromDip721: (arg_0: Principal, arg_1: Principal, arg_2: bigint) => Promise<TxReceipt>;
}

export default interface _SERVICE extends erc721_token {
}
