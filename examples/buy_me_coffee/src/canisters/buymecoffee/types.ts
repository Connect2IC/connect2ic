import type { Principal } from '@dfinity/principal';

export interface BuyMeCoffee {
  allPeople: () => Promise<Array<PeopleItem>>;
  create: (arg_0: PeopleUpdate) => Promise<Result>;
  delete: () => Promise<Result_1>;
  read: () => Promise<Result>;
  update: (arg_0: PeopleUpdate) => Promise<Result>;
}
export type Error =
  | { WrongCaller: null }
  | { NotFound: null }
  | { NotAuthorized: null }
  | { AlreadyExists: null };
export type ID = Principal;
export interface People {
  id: ID;
  name: string;
  wallet: Wallet;
}
export interface PeopleItem {
  principal: ID;
  people: People;
}
export interface PeopleUpdate {
  name: string;
  wallet: Wallet;
}
export type Result = { ok: People } | { err: Error };
export type Result_1 = { ok: boolean } | { err: Error };
export type Wallet = string;
export type _SERVICE = BuyMeCoffee;
