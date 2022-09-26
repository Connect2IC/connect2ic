/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/class-name-casing */
import { Principal } from "@dfinity/principal"

export type GetAllResult = DABCollection[];

export interface DABCollection {
  icon: string;
  name: string;
  description: string;
  principal_id: Principal;
  standard: string;
}

export interface NFTCanister {
  icon: string;
  name: string;
  description: string;
  timestamp: bigint;
  principal_id: Principal;
  standard: string;
}

export type OperationError =
  { NotAuthorized: null }
  | { BadParameters: null }
  | { NonExistentItem: null }
  | { ParamatersNotPassed: null };
export type OperationResponse = { Ok: boolean } | { Err: OperationError };
export default interface _SERVICE {
  add: (arg_0: DABCollection) => Promise<OperationResponse>;
  edit: (arg_0: string, arg_1: [] | [Principal], arg_2: [] | [string], arg_3: [] | [string], arg_4: [] | [string]) => Promise<OperationResponse>;
  get_all: () => Promise<GetAllResult>;
  get_canister: (arg_0: string) => Promise<[] | [NFTCanister]>;
  name: () => Promise<string>;
  remove: (arg_0: string) => Promise<OperationResponse>;
}
