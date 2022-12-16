import { Principal } from "@dfinity/principal"
import { default as DepartureLabs } from "../departure_labs/departure_labs"
import { default as DIP721 } from "../dip_721/dip_721"
import { default as DIP721v2 } from "../dip_721_v2/dip_721_v2"
import { default as EXT } from "../ext/ext"
import { default as CCC } from "../ccc/ccc"
import { default as ICPunks } from "../ic_punks/ic_punks"

export type NFTStandards =
  typeof EXT
  | typeof ICPunks
  | typeof DepartureLabs
  | typeof DIP721
  | typeof DIP721v2
  | typeof CCC;

export interface DABCollection {
  icon: string;
  name: string;
  description: string;
  principal_id: Principal;
  standard: string;
}

export interface NFTCollection {
  name: string;
  canisterId: string;
  standard: string;
  tokens: NFTDetails[];
  icon?: string;
  description?: string;
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
