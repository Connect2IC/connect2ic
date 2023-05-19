import { Actor, ActorSubclass } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"

import ExtService, { Metadata, TokenMetaData } from "./interfaces"
import {
  BalanceResponse,
  BurnParams,
  getDecimalsFromMetadata,
  InternalTokenMethods,
  SendParams,
  SendResponse,
} from "../methods"
import { Account, TokenWrapper } from "../token-interfaces"

class EXT implements TokenWrapper {

  actor: ActorSubclass<ExtService>
  canisterId: string
  standard = "EXT"

  constructor({
                actor,
                canisterId,
              }: {
    actor: ActorSubclass<ExtService>,
    canisterId: string
  }) {
    // super()
    this.actor = actor
    this.canisterId = canisterId
  }

  async getMetadata() {
    // actor.balance
    const token = Actor.canisterIdOf(this.actor).toText()

    const extensions = await this.actor.extensions()
    if (!extensions.includes("@ext/common")) {
      throw new Error("The provided canister does not implement commont extension")
    }
    const metadataResult = await this.actor.metadata(token)

    if ("ok" in metadataResult) {
      // return metadataResult.ok
      const details = metadataResult.ok.fungible
      // decimals, metadata: [], name, symbol
      return details
      // return {
      //   cycles: Number(details.cycles),
      //   deployTime: Number(details.deployTime),
      //   feeTo: { owner: details.feeTo, subaccount: [] },
      //   historySize: Number(details.historySize),
      //   holderNumber: Number(details.holderNumber),
      //   standard: this.standard,
      //   ...details.metadata,
      //   fee: Number(details.metadata.fee),
      //   totalSupply: Number(details.metadata.totalSupply),
      //   owner: { owner: details.metadata.owner, subaccount: [] },
      // }
    }

    throw new Error(Object.keys(metadataResult.err)[0])
  }

  async send({ to, from, amount }) {
    const dummyMemmo = new Array(32).fill(0)
    const token = Actor.canisterIdOf(this.actor).toText()
    const data = {
      to: { principal: Principal.fromText(to) },
      from: { principal: Principal.from(from) },
      amount,
      token,
      memo: dummyMemmo,
      notify: false,
      subaccount: [],
      fee: BigInt(0),
    }

    const transferResult = await this.actor.transfer(data)

    if ("ok" in transferResult) return { amount: transferResult.ok.toString() }

    throw new Error(Object.keys(transferResult.err)[0])
  }

  async mint(receiver: Account, amount: number): Promise<any> {
    // TODO:
  }

  async getBalance(user: Account) {
    const token = Actor.canisterIdOf(this.actor).toText()

    const balanceResult = await this.actor.balance({
      token,
      user: { principal: user.owner },
    })

    const decimals = await this.getDecimals()

    if ("ok" in balanceResult) {
      return { value: balanceResult.ok, decimals }
    }

    throw new Error(Object.keys(balanceResult.err)[0])
  }

  async getDecimals() {
    return getDecimalsFromMetadata(await this.getMetadata())
  }
}

export default EXT
