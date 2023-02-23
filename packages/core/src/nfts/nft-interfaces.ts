import { Principal } from "@dfinity/principal"
import { ActorSubclass } from "@dfinity/agent"
import { CapRoot, CapRouter } from "cap-js-without-npm-registry"
import EXT from "./ext/ext"
import DepartureLabs from "./departure_labs/departure_labs"
import DIP721 from "./dip_721/dip_721"
import DIP721v2 from "./dip_721_v2/dip_721_v2"
import CCC from "./ccc/ccc"
import ICPunks from "./ic_punks/ic_punks"

type SubAccount = [] | [Uint8Array];

export type Account = {
  owner: Principal;
  subaccount: SubAccount;
}

export interface NFTDetails {
  index: bigint;
  canister: string;
  id?: string;
  name?: string;
  url: string;
  metadata: any;
  standard: string;
  collection?: string;
  owner?: string;
  operator?: string;
}

export interface NFTMetadata {
  cycles?: number;
  deployTime?: number;
  historySize?: number;
  name: string;
  decimals: number;
  symbol: string;
  fee: number;
  feeTo: Account;
  holderNumber?: number;
  standard: string;
  totalSupply: number;
  owner: Account
}


export interface NFTWrapper {
  standard: string;

  actor: ActorSubclass<any>
  canisterId: string
  capRoot?: CapRoot
  capRouter?: CapRouter

  // new(actor: ActorSubclass<any>, canisterId: string): TokenWrapper

  init({ capRouterId }: { capRouterId?: string }): Promise<void>

  getUserTokens(user: Account): Promise<NFTDetails[]>

  mint(receiver: Account, metadata: any, tokenIndex?: bigint): Promise<any>

  transfer(args: { from: Account, to: Account, tokenIndex: bigint }): Promise<void>

  getMetadata(tokenIndex: bigint): Promise<NFTDetails>

  getHistory?(): Promise<{
    caller: string;
    // operation: tx.operation,
    time: number;
    // // TODO: account-id?
    from: string;
    to: string;
    amount: string;
    fee: string;
    status: string;
  }>
}

export type NFTStandards =
  typeof EXT
  | typeof ICPunks
  | typeof DepartureLabs
  | typeof DIP721
  | typeof DIP721v2
  | typeof CCC;