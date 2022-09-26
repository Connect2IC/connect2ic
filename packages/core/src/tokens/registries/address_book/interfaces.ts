import type { Principal } from "@dfinity/principal"

export type ValueType = { PrincipalId: Principal } | { AccountId: string } | { Icns: string };

export interface Address {
  name: string;
  description: [] | [string];
  emoji: [] | [string];
  value: ValueType;
}

export type Error = { NotAuthorized: null } | { BadParameters: null } | { Unknown: string } | { NonExistentItem: null };

export type Response = { Ok: [] | [string] } | { Err: Error };

export default interface AddressBookInterface {
  add: (arg_1: Address) => Promise<Response>;
  get_all: () => Promise<Array<Address>>;
  name: () => Promise<string>;
  remove: (arg_0: String) => Promise<Response>;
}
