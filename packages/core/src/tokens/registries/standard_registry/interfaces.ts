import type { Principal } from "@dfinity/principal"

export type DetailType = bigint | Array<DetailType> | Array<number> | string | true | false | number | Principal;
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
export type Error = { NotAuthorized: null } | { BadParameters: null } | { Unknown: string } | { NonExistentItem: null };

export interface Metadata {
  thumbnail: string;
  name: string;
  frontend: [] | [string];
  description: string;
  principal_id: Principal;
  details: Array<[string, DetailValue]>;
}

export type Response = { Ok: [] | [string] } | { Err: Error };
export default interface RegistryStandard {
  add: (arg_1: Metadata) => Promise<Response>;
  get: (arg_0: Principal) => Promise<[] | [Metadata]>;
  name: () => Promise<string>;
  remove: (arg_0: Principal) => Promise<Response>;
}
