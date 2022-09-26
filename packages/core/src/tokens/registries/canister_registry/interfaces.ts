import type { Principal } from "@dfinity/principal"
import RegistryStandard from "../standard_registry/interfaces"

export interface CanisterMetadata {
  thumbnail: string;
  name: string;
  frontend: [] | [string];
  description: string;
  principal_id: Principal;
  details: Array<[string, DetailValue]>;
}

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
export type OperationError =
  { NotAuthorized: null }
  | { BadParameters: null }
  | { Unknown: string }
  | { NonExistentItem: null };
export type OperationResponse = { Ok: [] | [string] } | { Err: OperationError };
export default interface CanisterRegistry extends RegistryStandard {
  add: (arg_1: CanisterMetadata) => Promise<OperationResponse>;
  get: (arg_0: Principal) => Promise<[] | [CanisterMetadata]>;
  get_all: () => Promise<Array<CanisterMetadata>>;
  name: () => Promise<string>;
  remove: (arg_0: Principal) => Promise<OperationResponse>;
}
