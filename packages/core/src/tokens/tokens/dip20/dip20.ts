/* eslint-disable @typescript-eslint/camelcase */
import { Principal } from "@dfinity/principal"
import { ActorSubclass } from "@dfinity/agent"

import { _SERVICE as Dip20Service } from "./interfaces"
import {
  BalanceResponse,
  BurnParams,
  getDecimalsFromMetadata,
  InternalTokenMethods,
  SendParams,
  SendResponse,
} from "../methods"
import { TokenStandards } from "../index"
import { CapRouter, CapRoot } from "cap-js-without-npm-registry"
import { Account, TokenMetadata, TokenWrapper } from "../token-interfaces"

enum Errors {
  CAP_NOT_INITIALIZED = "CAP_NOT_INITIALIZED",
}

export default class Dip20 implements TokenWrapper {
  standard = "DIP20"

  actor: ActorSubclass<Dip20Service>
  canisterId: string
  capRoot?: CapRoot
  capRouter?: CapRouter

  constructor({
                actor,
                canisterId,
                capRouter,
                capRoot,
              }: {
    actor: ActorSubclass<Dip20Service>,
    canisterId: string,
    capRouter?: CapRouter,
    capRoot?: CapRoot,
  }) {
    // super()
    this.actor = actor
    this.canisterId = canisterId
    this.capRouter = capRouter
    this.capRoot = capRoot
  }

  // TODO: !!!

  // public async init({ capRouterId }) {
  //   if (capRouterId) {
  //     this.capRouter = await CapRouter.init({
  //       // TODO: get settings
  //       // host: window.location.origin,
  //       canisterId: capRouterId,
  //     })
  //     // @ts-ignore
  //     this.capRoot = await CapRoot.init({
  //       tokenId: this.canisterId,
  //       router: this.capRouter,
  //       // host: window.location.origin,
  //     })
  //   }
  // }

  public async getMetadata(): Promise<TokenMetadata> {
    const details = await this.actor.getTokenInfo()
    return {
      cycles: Number(details.cycles),
      deployTime: Number(details.deployTime),
      feeTo: { owner: details.feeTo, subaccount: [] },
      historySize: Number(details.historySize),
      holderNumber: Number(details.holderNumber),
      standard: this.standard,
      ...details.metadata,
      fee: Number(details.metadata.fee),
      totalSupply: Number(details.metadata.totalSupply),
      owner: { owner: details.metadata.owner, subaccount: [] },
    }
  }

  public async getHolders(start = 0, end = 999999999) {
    const holders = await this.actor.getHolders(BigInt(start), BigInt(end))
    return holders.map(holder => ({
      address: holder[0].toText(),
      balance: Number(holder[1]),
    }))
  }

  public async getHistory() {
    if (this.capRoot) {
      const result = await this.capRoot.get_transactions({
        witness: false,
      })
      return result.data.map((tx) => ({
        caller: tx.caller.toText(),
        operation: tx.operation,
        time: Number(tx.time),
        // TODO: account-id?
        from: tx.details[0][1].Principal.toText(),
        to: tx.details[1][1].Principal.toText(),
        amount: tx.details[2][1].Slice.toString(),
        fee: tx.details[3][1].Slice.toString(),
        status: tx.details[4][1].Text,
      }))
    }
    throw new Error({ kind: Errors.CAP_NOT_INITIALIZED })
  }

  async mint(receiver: Principal, amount: number): Promise<any> {
    const mintResult = await this.actor.mint(receiver, BigInt(amount))
    if ("Err" in mintResult) {
      console.error(mintResult.Err)
    }
    if ("Ok" in mintResult) {
      return mintResult
    }
  }

  public async send({ to, amount }: SendParams): Promise<SendResponse> {
    const transferResult = await this.actor.transfer(Principal.fromText(to), BigInt(amount))

    if ("Ok" in transferResult) return { transactionId: transferResult.Ok.toString() }

    throw new Error(Object.keys(transferResult.Err)[0])
  }

  public async getBalance(user: Account) {
    // TODO:
    // const decimals = await this.getDecimals()
    const decimals = 0
    const value = await this.actor.balanceOf(user.owner)
    // const value = 0n
    return { value, decimals }
  }

  // public async burnXTC(_actor: ActorSubclass<Dip20Service>, _params: BurnParams) {
  //   throw new Error("BURN NOT SUPPORTED")
  // }

  public async getDecimals() {
    let metadata = await this.getMetadata()
    return getDecimalsFromMetadata(metadata)
  }
}
