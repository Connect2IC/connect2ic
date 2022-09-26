import { Principal } from "@dfinity/principal"

export interface TransferResponse {
  ok: bigint;
  err: Error;
}

export interface Error {
  NotFoundIndex: null;
  ListOnMarketPlace: null;
  NotAllowTransferToSelf: null;
  NotOwnerOrNotApprove: null;
  Other: null;
}

export interface TokenDetails {
  id: bigint;
  rarityScore: number;
}

export interface GetTokenResponse {
  ok: TokenDetails;
  err: Error;
}

export interface Property {
  value: string;
  name: string;
}

export default interface _SERVICE {
  getTokenById: (token_index: bigint) => Promise<GetTokenResponse>;
  transferFrom: (from: Principal, to: Principal, tokenIndex: bigint) => Promise<TransferResponse>;
  getAllNFT: (user: Principal) => Promise<Array<Array<any>>>;
  getNftStoreCIDByIndex: (token_index: bigint) => Promise<Principal>;
}
