/* eslint-disable @typescript-eslint/camelcase */
import { Principal } from "@dfinity/principal"
import { ActorSubclass } from "@dfinity/agent"
import fetch from "cross-fetch"

import LedgerService from "./interfaces"
import { Metadata } from "../ext/interfaces"
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

type BaseLedgerService = LedgerService;

const DECIMALS = 8

const NET_ID = {
  blockchain: "Internet Computer",
  network: "00000000000000020101",
}
const ROSETTA_URL = "https://rosetta-api.internetcomputer.org"

const getMetadata = async (_actor: ActorSubclass<BaseLedgerService>): Promise<Metadata> => {
  return {
    fungible: {
      symbol: "ICP",
      decimals: DECIMALS,
      name: "ICP",
    },
  }
}

const send = async (actor: ActorSubclass<BaseLedgerService>, {
  to,
  amount,
  opts,
}: SendParams): Promise<SendResponse> => {
  const defaultArgs = {
    fee: BigInt(10000),
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
  const accountId = getAccountId(user)
  const decimals = await getDecimals(actor)
  const response = await fetch(`${ROSETTA_URL}/account/balance`, {
    method: "POST",
    body: JSON.stringify({
      network_identifier: NET_ID,
      account_identifier: {
        address: accountId,
      },
    }),
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
  })
  if (!response.ok) {
    return { value: "Error", decimals, error: response.statusText }
  }
  const { balances } = await response.json()
  const [{ value, currency }] = balances
  return { value, decimals: currency.decimals }
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
