/* eslint-disable @typescript-eslint/camelcase */
import { Principal } from "@dfinity/principal"
import { ActorSubclass } from "@dfinity/agent"
import fetch from "cross-fetch"

import LedgerService from "./interfaces"
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
import { Account, TokenWrapper } from "../token-interfaces"

const DECIMALS = 8

const NET_ID = {
  blockchain: "Internet Computer",
  network: "00000000000000020101",
}
const ROSETTA_URL = "https://rosetta-api.internetcomputer.org"

class Ledger implements TokenWrapper {
  standard = "ICP"
  actor: ActorSubclass<LedgerService>
  canisterId: string

  constructor({ actor, canisterId }: { actor: ActorSubclass<LedgerService>, canisterId: string }) {
    this.actor = actor
    this.canisterId = canisterId
  }

  async getMetadata() {
    return {
      symbol: "ICP",
      decimals: DECIMALS,
      name: "ICP",
    }
  }

  async send({
               to,
               amount,
               opts,
             }: SendParams) {
    const defaultArgs = {
      fee: BigInt(10000),
      memo: BigInt(0),
    }
    const response = await this.actor.send_dfx({
      to: validatePrincipalId(to) ? getAccountId(Principal.fromText(to)) : to,
      fee: { e8s: opts?.fee || defaultArgs.fee },
      amount: { e8s: amount },
      memo: opts?.memo ? BigInt(opts.memo) : defaultArgs.memo,
      from_subaccount: [], // For now, using default subaccount to handle ICP
      created_at_time: [],
    })

    return { height: await response.toString() }
  }

  async mint(receiver: Account, amount: number) {
    // TODO:
  }

  async getBalance(user: Account) {
    const accountId = getAccountId(user.owner)
    const decimals = await this.getDecimals()
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
      // TODO: ??
      return { value: "Error", decimals, error: response.statusText }
    }
    const { balances } = await response.json()
    const [{ value, currency }] = balances
    return { value, decimals: currency.decimals }
  }

  async getDecimals() {
    return getDecimalsFromMetadata(await this.getMetadata())
  }
}

export default Ledger
