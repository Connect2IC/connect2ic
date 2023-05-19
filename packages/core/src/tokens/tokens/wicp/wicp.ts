/* eslint-disable @typescript-eslint/camelcase */
import { Principal } from "@dfinity/principal"
import { ActorSubclass } from "@dfinity/agent"

import WICPService from "./interfaces"
import { Metadata } from "../ext/interfaces"
import {
  BalanceResponse,
  BurnParams,
  getDecimalsFromMetadata,
  InternalTokenMethods,
  SendParams,
  SendResponse,
} from "../methods"
import { Account, TokenWrapper } from "../token-interfaces"


class WICP implements TokenWrapper {

  standard = "WICP"
  actor: ActorSubclass<WICPService>
  canisterId: string

  constructor({ actor, canisterId }: { actor: ActorSubclass<WICPService>, canisterId: string }) {
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

  async send({ to, amount }: SendParams) {
    const transferResult = await this.actor.transfer(Principal.fromText(to), amount)

    if ("Ok" in transferResult) return { transactionId: transferResult.Ok.toString() }

    throw new Error(Object.keys(transferResult.Err)[0])
  }

  async mint(receiver: Account, amount: number) {
    // TODO:
  }

  async getBalance(user: Account) {
    const decimals = await this.getDecimals()
    const value = await this.actor.balanceOf(user.owner)
    return { value, decimals }
  }

  async getDecimals() {
    return getDecimalsFromMetadata(await this.getMetadata())
  }
}

export default WICP
