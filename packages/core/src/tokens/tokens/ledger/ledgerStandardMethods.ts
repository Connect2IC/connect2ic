/* eslint-disable @typescript-eslint/camelcase */
import { Principal } from "@dfinity/principal"
import { Actor, ActorSubclass } from "@dfinity/agent"

import LedgerService from "./interfaces"
import { FungibleMetadata, Metadata } from "../ext/interfaces"
import {
  BalanceResponse,
  BurnParams,
  getDecimalsFromMetadata,
  InternalTokenMethods,
  SendParams,
  SendResponse,
} from "../methods"
import { getAccountId } from "../../dab_utils/account"
import { validatePrincipalId } from "../../dab_utils/validations"
import { TokenRegistry } from "../../registries/token_registry/token_registry"

type BaseLedgerService = LedgerService;

const getMetadata = async (_actor: ActorSubclass<BaseLedgerService>): Promise<Metadata> => {
  const tokenRegistry = new TokenRegistry()
  const token = await tokenRegistry.get(Actor.canisterIdOf(_actor).toString())
  return {
    fungible: {
      symbol: (token?.details?.symbol as string) || "ICP",
      decimals: (token?.details?.decimals as number) || 8,
      name: (token?.name as string) || "ICP",
      fee: (token?.details?.fee as number) || 10000,
    },
  }
}

const send = async (actor: ActorSubclass<BaseLedgerService>, {
  to,
  amount,
  opts,
}: SendParams): Promise<SendResponse> => {
  const metadata = await getMetadata(actor)
  const { fee = 0.002, decimals = BigInt(8) } = (metadata as FungibleMetadata)?.fungible || {}
  const defaultArgs = {
    fee: BigInt(fee * 10 ** parseInt(decimals.toString(), 10)),
    memo: BigInt(0),
  }
  const response = await actor.send_dfx({
    to: validatePrincipalId(to) ? getAccountId(Principal.fromText(to)) : to,
    fee: { e8s: opts?.fee || defaultArgs.fee },
    amount: { e8s: amount },
    memo: opts?.memo ? BigInt(opts.memo) : defaultArgs.memo,
    from_subaccount: [], // For now, using default subaccount to handle ICP
    created_at_time: [],
  })

  return { height: await response.toString() }
}

const getBalance = async (actor: ActorSubclass<BaseLedgerService>, user: Principal): Promise<BalanceResponse> => {
  try {
    const account = getAccountId(user)
    const balance = await actor.account_balance_dfx({ account })
    return { value: balance.e8s.toString(), decimals: 8 }
  } catch (e) {
    return { value: "Error", decimals: 8, error: "Error while fetching your balance" }
  }
}

const burnXTC = async (_actor: ActorSubclass<BaseLedgerService>, _params: BurnParams) => {
  throw new Error("BURN NOT SUPPORTED")
}

const getDecimals = async (actor: ActorSubclass<BaseLedgerService>) => getDecimalsFromMetadata(await getMetadata(actor))

export default {
  send,
  getMetadata,
  getBalance,
  burnXTC,
  getDecimals,
} as InternalTokenMethods
