import fetch from "cross-fetch"
import {
  Actor,
  ActorSubclass,
  HttpAgent,
  HttpAgentOptions,
} from "@dfinity/agent"
import { Principal } from "@dfinity/principal"

import { KyaConnector } from "./kyasshu"
import _ROUTER_SERVICE from "./declarations/router"
import _ROOT_SERVICE from "./declarations/root"
import { routerFactory } from "./declarations/router.did.js"
import { rootFactory } from "./declarations/root.did.js"

import {
  GetUserRootBucketsResponse,
  GetTokenContractRootBucketResponse,
  GetTransactionResponse,
  GetTransactionsResponseBorrowed,
  GetIndexCanistersResponse,
  IndefiniteEvent,
} from "./declarations"

export type {
  Root,
  Event,
  GetBucketResponse,
  GetNextCanistersResponse,
  GetTransactionResponse,
  GetTransactionsArg,
  GetTransactionsResponseBorrowed,
  GetUserTransactionsArg,
  IndefiniteEvent,
  DetailValue,
  WithIdArg,
  WithWitnessArg,
  Witness,
  Router,
  GetIndexCanistersResponse,
  GetTokenContractRootBucketArg,
  GetTokenContractRootBucketResponse,
  GetUserRootBucketsArg,
  GetUserRootBucketsResponse,
} from "./declarations"

import {
  CanisterInfo,
  KyaUrl,
  DFX_JSON_HISTORY_ROUTER_KEY_NAME,
} from "./config"
import { KyaStage } from "./kyasshu/types"

export { CanisterInfo }

export const Hosts = {
  mainnet: "https://ic0.app",
  local: "http://localhost:8000",
}

type IdlFactory = ({ IDL }: { IDL: any }) => any;

export interface ActorParams {
  host: string;
  canisterId: string;
  idlFactory: IdlFactory;
}

type CreateActorFromTokenParams =
  | {
  tokenId: string;
  router: CapRouter;
}
  | {
  tokenId: string;
  host: string;
  routerCanisterId: string;
};

interface CreateActorFromRootParams {
  canisterId: string;
}

interface BaseCreateActorParams {
  host: string;
  idlFactory: IdlFactory;
}

interface BaseInitParams {
  host: string;
}

type CreateActorParams = BaseCreateActorParams &
  (CreateActorFromRootParams | CreateActorFromTokenParams);

type InitRootParams = BaseInitParams &
  (CreateActorFromRootParams | CreateActorFromTokenParams);

export class CapBase<T> {
  public actor: ActorSubclass<T>

  public cache: KyaConnector | undefined

  constructor(actor: ActorSubclass<T>, cache?: KyaConnector) {
    this.actor = actor
    if (cache) {
      this.cache = cache
    }
  }

  private static createActor<T>({
                                  host,
                                  idlFactory,
                                  ...args
                                }: CreateActorParams): ActorSubclass<T> | Promise<ActorSubclass<T>> {
    const agent = new HttpAgent({
      host,
      fetch,
    } as unknown as HttpAgentOptions)
    if (process.env.NODE_ENV !== "production") {
      try {
        agent.fetchRootKey()
      } catch (err) {
        console.warn(
          "Oops! Unable to fetch root key, is the local replica running?",
        )
        console.error(err)
      }
    }

    if ("canisterId" in args) {
      return Actor.createActor(idlFactory, {
        agent,
        canisterId: args.canisterId,
      })
    }

    return (async () => {
      const router =
        "router" in args
          ? args.router
          : await CapRouter.init({
            host,
            canisterId: args.routerCanisterId,
          })

      const { canister } = await router.get_token_contract_root_bucket({
        canister: Principal.fromText(args.tokenId),
      })

      if (!canister?.[0]) throw Error(`Token ${args.tokenId} not in cap`)

      return Actor.createActor<T>(idlFactory, {
        agent,
        canisterId: canister[0],
      })
    })()
  }

  public static inititalise<T>({
                                 host,
                                 idlFactory,
                                 ...args
                               }: CreateActorParams) {
    const actor = CapBase.createActor<T>({
      host,
      idlFactory,
      ...args,
    })

    return actor
  }
}

export class CapRouter extends CapBase<_ROUTER_SERVICE> {
  public static init({
                       host = Hosts.mainnet,
                       canisterId = CanisterInfo[DFX_JSON_HISTORY_ROUTER_KEY_NAME].mainnet,
                     }: {
    host?: string;
    canisterId?: string;
  }) {
    return (async () => {
      const actor = await CapBase.inititalise<_ROUTER_SERVICE>({
        host,
        canisterId,
        idlFactory: routerFactory,
      })

      const cap = new CapRouter(actor)

      return cap
    })()
  }

  public async trigger_upgrade(): Promise<undefined> {
    return this.actor.trigger_upgrade()
  }

  public async get_index_canisters({
                                     witness = false,
                                   }: {
    witness?: boolean;
  }): Promise<GetIndexCanistersResponse> {
    return this.actor.get_index_canisters({
      witness,
    })
  }

  public async get_token_contract_root_bucket({
                                                canister,
                                                witness = false,
                                              }: {
    canister: Principal;
    witness?: boolean;
  }): Promise<GetTokenContractRootBucketResponse> {
    return this.actor.get_token_contract_root_bucket({
      canister,
      witness,
    })
  }

  public async get_user_root_buckets({
                                       user,
                                       witness = false,
                                     }: {
    user: Principal;
    witness?: boolean;
  }): Promise<GetUserRootBucketsResponse> {
    return this.actor.get_user_root_buckets({
      user,
      witness,
    })
  }

  public async insert_new_users(
    contractId: Principal,
    users: Principal[],
  ): Promise<undefined> {
    return this.actor.insert_new_users(contractId, users)
  }

  public async install_bucket_code(canisterId: Principal) {
    return this.actor.install_bucket_code(canisterId)
  }
}

export class CapRoot extends CapBase<_ROOT_SERVICE> {
  public static init({ host = Hosts.mainnet, ...args }: InitRootParams) {
    return (async () => {
      const actor = await CapBase.inititalise<_ROOT_SERVICE>({
        host,
        idlFactory: rootFactory,
        ...args,
      })

      return new CapRoot(actor)
    })()
  }

  public async contract_id(): Promise<Principal> {
    return this.actor.contract_id()
  }

  public async balance(): Promise<bigint> {
    return this.actor.balance()
  }

  public async get_transaction(
    id: bigint,
    witness = false,
  ): Promise<GetTransactionResponse> {
    return this.actor.get_transaction({
      id,
      witness,
    })
  }

  public async get_transactions({
                                  witness = false,
                                  page,
                                }: {
    witness?: boolean;
    page?: number;
  }): Promise<GetTransactionsResponseBorrowed> {
    return this.actor.get_transactions({
      page: typeof page === "number" ? [page] : [],
      witness,
    })
  }

  public async get_user_transactions({
                                       page,
                                       user,
                                       witness = false,
                                     }: {
    page?: number;
    user: Principal;
    witness?: boolean;
  }): Promise<GetTransactionsResponseBorrowed> {
    return this.actor.get_user_transactions({
      page: typeof page === "number" ? [page] : [],
      user,
      witness,
    })
  }

  public async get_token_transactions({
                                        page,
                                        token_id,
                                        witness = false,
                                      }: {
    page?: number;
    token_id: bigint;
    witness?: boolean;
  }): Promise<GetTransactionsResponseBorrowed> {
    return this.actor.get_token_transactions({
      page: typeof page === "number" ? [page] : [],
      token_id,
      witness,
    })
  }

  public async insert({
                        operation,
                        details,
                        caller,
                      }: IndefiniteEvent): Promise<bigint> {
    return this.actor.insert({
      operation,
      details,
      caller,
    })
  }

  public async size(): Promise<bigint> {
    return this.actor.size()
  }
}

export class CapCache extends CapBase<_ROOT_SERVICE> {
  constructor(cacheStage: KyaStage = "prod") {
    const actor = CapBase.inititalise<_ROOT_SERVICE>({
      host: Hosts.mainnet,
      canisterId: CanisterInfo[DFX_JSON_HISTORY_ROUTER_KEY_NAME].mainnet,
      idlFactory: rootFactory,
    }) as ActorSubclass<_ROOT_SERVICE>

    const cache = new KyaConnector(KyaUrl(cacheStage))

    super(actor, cache)
  }

  public async get_all_user_transactions({
                                           user,
                                           LastEvaluatedKey,
                                         }: {
    user: Principal;
    LastEvaluatedKey?: unknown;
  }): Promise<unknown> {
    return this.cache?.request({
      path: `cap/user/txns/${user.toString()}`,
      params: [
        {
          LastEvaluatedKey,
        },
      ],
    })
  }
}
