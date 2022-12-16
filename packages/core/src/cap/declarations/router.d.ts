import type { Principal } from "@dfinity/principal";

export interface GetIndexCanistersResponse {
  witness: [] | [Witness];
  canisters: Array<Principal>;
}
export interface GetTokenContractRootBucketArg {
  witness: boolean;
  canister: Principal;
}
export interface GetTokenContractRootBucketResponse {
  witness: [] | [Witness];
  canister: [] | [Principal];
}
export interface GetUserRootBucketsArg {
  user: Principal;
  witness: boolean;
}
export interface GetUserRootBucketsResponse {
  witness: [] | [Witness];
  contracts: Array<Principal>;
}
export interface WithWitnessArg {
  witness: boolean;
}
export interface Witness {
  certificate: Array<number>;
  tree: Array<number>;
}
export default interface _SERVICE {
  deploy_plug_bucket: (arg_0: Principal, arg_1: bigint) => Promise<undefined>;
  get_index_canisters: (
    arg_0: WithWitnessArg
  ) => Promise<GetIndexCanistersResponse>;
  get_token_contract_root_bucket: (
    arg_0: GetTokenContractRootBucketArg
  ) => Promise<GetTokenContractRootBucketResponse>;
  get_user_root_buckets: (
    arg_0: GetUserRootBucketsArg
  ) => Promise<GetUserRootBucketsResponse>;
  insert_new_users: (
    arg_0: Principal,
    arg_1: Array<Principal>
  ) => Promise<undefined>;
  install_bucket_code: (arg_0: Principal) => Promise<undefined>;
  trigger_upgrade: () => Promise<undefined>;
}