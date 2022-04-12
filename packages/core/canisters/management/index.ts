import managementCanisterIdl from "./management_idl"
// import { Actor, ActorSubclass, CallConfig } from '../actor';
import { Principal } from '@dfinity/principal';
// import _SERVICE from './management_service';
//
// export type ManagementCanisterRecord = _SERVICE;

export const canisterId = Principal.fromHex('').toString()

export { managementCanisterIdl as idlFactory }

/**
 * Create a management canister actor
 * @param config
 */
// export function getManagementCanister(config: CallConfig): ActorSubclass<ManagementCanisterRecord> {
//   function transform(_methodName: string, args: unknown[], _callConfig: CallConfig) {
//     const first = args[0] as any;
//     let effectiveCanisterId = Principal.fromHex('');
//     if (first && typeof first === 'object' && first.canister_id) {
//       effectiveCanisterId = Principal.from(first.canister_id as unknown);
//     }
//     return { effectiveCanisterId };
//   }
//
//   return Actor.createActor<ManagementCanisterRecord>(managementCanisterIdl, {
//     ...config,
//     canisterId: Principal.fromHex(''),
//     ...{
//       callTransform: transform,
//       queryTransform: transform,
//     },
//   });
// }
