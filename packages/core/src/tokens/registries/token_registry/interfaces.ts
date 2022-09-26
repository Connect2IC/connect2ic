import type { Principal } from "@dfinity/principal"
import RegistryStandard from "../standard_registry/interfaces"

export type detail_value =
  | { I64: bigint }
  | { U64: bigint }
  | { Vec: Array<detail_value> }
  | { Slice: Array<number> }
  | { Text: string }
  | { True: null }
  | { False: null }
  | { Float: number }
  | { Principal: Principal };
export type operation_error =
  { NotAuthorized: null }
  | { BadParameters: null }
  | { Unknown: string }
  | { NonExistentItem: null };
export type operation_response = { Ok: [] | [string] } | { Err: operation_error };

export interface token {
  thumbnail: string;
  name: string;
  frontend: [] | [string];
  description: string;
  principal_id: Principal;
  details: Array<[string, detail_value]>;
}

export default interface TokenRegistry extends RegistryStandard {
  add: (arg_1: token) => Promise<operation_response>;
  get: (arg_0: Principal) => Promise<[] | [token]>;
  get_all: () => Promise<Array<token>>;
  name: () => Promise<string>;
  remove: (arg_0: Principal) => Promise<operation_response>;
  set_controller: (arg_0: Principal) => Promise<operation_response>;
}
