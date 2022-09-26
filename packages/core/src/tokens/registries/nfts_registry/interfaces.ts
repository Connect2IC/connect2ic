import type { Principal } from "@dfinity/principal"
import RegistryStandard from "../standard_registry/interfaces"

export type DetailValue =
  | { I64: bigint }
  | { U64: bigint }
  | { Vec: Array<DetailValue> }
  | { Slice: Array<number> }
  | { Text: string }
  | { True: null }
  | { False: null }
  | { Float: number }
  | { Principal: Principal };

export interface NFTCanisterMetadata {
  thumbnail: string;
  name: string;
  frontend: [] | [string];
  description: string;
  principal_id: Principal;
  details: Array<[string, DetailValue]>;
}

export type Error = { NotAuthorized: null } | { BadParameters: null } | { Unknown: string } | { NonExistentItem: null };
export type Response = { Ok: [] | [string] } | { Err: Error };
export default interface NFTRegistryInterface extends RegistryStandard {
  add: (arg_1: NFTCanisterMetadata) => Promise<Response>;
  edit: (arg_0: Principal, arg_1: [] | [string], arg_2: [] | [string], arg_3: [] | [string], arg_4: [] | [string]) => Promise<Response>;
  get: (arg_0: Principal) => Promise<[] | [NFTCanisterMetadata]>;
  get_all: () => Promise<Array<NFTCanisterMetadata>>;
  name: () => Promise<string>;
  remove: (arg_0: Principal) => Promise<Response>;
  set_controller: (arg_0: Principal) => Promise<Response>;
}
