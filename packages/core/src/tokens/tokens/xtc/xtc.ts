/* eslint-disable @typescript-eslint/camelcase */
import { Principal } from "@dfinity/principal"
import { ActorSubclass } from "@dfinity/agent"

import XtcService, { BurnResult } from "./interfaces"
import { Metadata } from "../ext/interfaces"
import {
  BalanceResponse,
  BurnParams,
  getDecimalsFromMetadata,
  InternalTokenMethods,
  parseAmountToSend,
  SendParams,
  SendResponse,
} from "../methods"
import { Account, TokenMetadata, TokenWrapper } from "../token-interfaces"
// import { _SERVICE as Dip20Service } from "../dip20/interfaces"
// import { CapRoot, CapRouter } from "cap-js-without-npm-registry"

export default class XTC implements TokenWrapper {
  standard = "XTC"

  actor: ActorSubclass<XtcService>
  canisterId: string
  // capRoot?: CapRoot
  // capRouter?: CapRouter

  constructor({ actor, canisterId }: { actor: ActorSubclass<XtcService>, canisterId: string }) {
    // super()
    this.actor = actor
    this.canisterId = canisterId
  }

  async getMetadata() {
    const metadataResult = await this.actor.getMetadata()
    return {
      symbol: metadataResult.symbol,
      decimals: metadataResult.decimals,
      name: metadataResult.name,
    }
  }

  async send({ to, amount }: SendParams): Promise<SendResponse> {
    const transferResult = await this.actor.transferErc20(Principal.fromText(to), amount)

    if ("Ok" in transferResult) return { transactionId: transferResult.Ok.toString() }

    throw new Error(Object.keys(transferResult.Err)[0])
  }

  async mint(receiver: Account, amount: number) {
    // TODO:
  }

  async getBalance(user: Account) {
    const decimals = await this.getDecimals()
    const value = await this.actor.balance([user.owner])
    return { value, decimals }
  }

  async burnXTC(actor: ActorSubclass<XtcService>, { to, amount }: BurnParams): Promise<BurnResult> {
    const decimals = await this.getDecimals()
    const parsedAmount = parseAmountToSend(amount, decimals)
    return actor.burn({ canister_id: to, amount: parsedAmount })
  }

  async getDecimals() {
    return getDecimalsFromMetadata(await this.getMetadata())
  }
}

// export default {
//   send,
//   getMetadata,
//   getBalance,
//   burnXTC,
//   getDecimals,
// } as InternalTokenMethods
