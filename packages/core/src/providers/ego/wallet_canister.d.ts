import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface CallCanisterArgs {
  'args' : Array<number>,
  'cycles' : bigint,
  'method_name' : string,
  'canister' : Principal,
}
export interface CallResult { 'return' : Array<number> }
export interface ExpiryUser {
  'user' : Principal,
  'expiry_timestamp' : bigint,
  'timestamp' : bigint,
}
export type Result = { 'Ok' : bigint } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : null } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : CallResult } |
  { 'Err' : string };
export interface _SERVICE {
  'add_expiry_user' : ActorMethod<[Principal, [] | [bigint]], ExpiryUser>,
  'balance_get' : ActorMethod<[], Result>,
  'ego_canister_add' : ActorMethod<[string, Principal], Result_1>,
  'ego_controller_add' : ActorMethod<[Principal], Result_1>,
  'ego_controller_remove' : ActorMethod<[Principal], Result_1>,
  'ego_controller_set' : ActorMethod<[Array<Principal>], Result_1>,
  'ego_op_add' : ActorMethod<[Principal], Result_1>,
  'ego_owner_add' : ActorMethod<[Principal], Result_1>,
  'ego_owner_remove' : ActorMethod<[Principal], Result_1>,
  'ego_owner_set' : ActorMethod<[Array<Principal>], Result_1>,
  'ego_user_add' : ActorMethod<[Principal], Result_1>,
  'ego_user_remove' : ActorMethod<[Principal], Result_1>,
  'ego_user_set' : ActorMethod<[Array<Principal>], Result_1>,
  'proxy_call' : ActorMethod<[CallCanisterArgs], Result_2>,
  'set_expiry_period' : ActorMethod<[bigint], undefined>,
}
