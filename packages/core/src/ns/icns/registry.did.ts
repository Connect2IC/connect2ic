import type { Principal } from '@dfinity/principal';
/** @internal */
export interface ICNSRegistry {
  'addWhitelist': (arg_0: string) => Promise<boolean>,
  'approve': (arg_0: string, arg_1: Principal) => Promise<TxReceipt>,
  'balanceOf': (arg_0: Principal) => Promise<bigint>,
  'controller': (arg_0: string) => Promise<[] | [Principal]>,
  'expiry': (arg_0: string) => Promise<[] | [Time]>,
  'exportOwnerDomains': () => Promise<Array<[Principal, Array<string>]>>,
  'getApproved': (arg_0: string) => Promise<[] | [Principal]>,
  'getControllerDomains': (arg_0: Principal) => Promise<
    [] | [Array<RecordExt>]
    >,
  'getInfo': () => Promise<Info>,
  'getRecord': (arg_0: string) => Promise<[] | [RecordExt]>,
  'getUserDomains': (arg_0: Principal) => Promise<[] | [Array<RecordExt>]>,
  'isApproved': (arg_0: string, arg_1: Principal) => Promise<boolean>,
  'isApprovedForAll': (arg_0: Principal, arg_1: Principal) => Promise<boolean>,
  'isWhitelisted': (arg_0: string) => Promise<boolean>,
  'owner': (arg_0: string) => Promise<[] | [Principal]>,
  'recordExists': (arg_0: string) => Promise<boolean>,
  'removeWhitelist': (arg_0: string) => Promise<boolean>,
  'resolver': (arg_0: string) => Promise<[] | [Principal]>,
  'setApprovalForAll': (arg_0: Principal, arg_1: boolean) => Promise<
    TxReceipt
    >,
  'setController': (arg_0: string, arg_1: Principal) => Promise<TxReceipt>,
  'setOwner': (arg_0: string, arg_1: Principal) => Promise<TxReceipt>,
  'setRecord': (
    arg_0: string,
    arg_1: Principal,
    arg_2: Principal,
    arg_3: bigint,
    arg_4: Time,
  ) => Promise<TxReceipt>,
  'setResolver': (arg_0: string, arg_1: Principal) => Promise<TxReceipt>,
  'setSubnodeExpiry': (arg_0: string, arg_1: string, arg_2: Time) => Promise<
    TxReceipt
    >,
  'setSubnodeOwner': (
    arg_0: string,
    arg_1: string,
    arg_2: Principal,
  ) => Promise<TxReceipt>,
  'setSubnodeRecord': (
    arg_0: string,
    arg_1: string,
    arg_2: Principal,
    arg_3: Principal,
    arg_4: bigint,
    arg_5: Time,
  ) => Promise<TxReceipt>,
  'setTTL': (arg_0: string, arg_1: bigint) => Promise<TxReceipt>,
  'transfer': (arg_0: Principal, arg_1: string) => Promise<TxReceipt>,
  'transferFrom': (
    arg_0: Principal,
    arg_1: Principal,
    arg_2: string,
  ) => Promise<TxReceipt>,
  'ttl': (arg_0: string) => Promise<[] | [bigint]>,
}
interface Info {
  'memSize': bigint,
  'heapSize': bigint,
  'historySize': bigint,
  'cycles': bigint,
  'names': bigint,
  'users': bigint,
}
export interface RecordExt {
  'ttl': bigint,
  'controller': Principal,
  'resolver': Principal,
  'owner': Principal,
  'operator': Principal,
  'name': string,
  'expiry': Time,
}
type Time = bigint;
type TxReceipt = { 'ok': bigint } |
  { 'err': string };