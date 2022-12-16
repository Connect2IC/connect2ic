/* eslint-disable @typescript-eslint/camelcase */
import { Principal } from "@dfinity/principal"
import { ActorSubclass } from "@dfinity/agent"

import { _SERVICE as Icrc1Service } from "./interfaces"
import { Metadata } from "../ext/interfaces"
import {
  BalanceResponse,
  BurnParams,
  getDecimalsFromMetadata,
  InternalTokenMethods,
  SendParams,
  SendResponse,
} from "../methods"
// import { CapRouter } from "../../../cap"
import { CapRouter } from "cap-js-without-npm-registry"
import { Opt } from "../../../utils"
import { Account, TokenWrapper } from "../token-interfaces"

// TODO: rename
const toValue = (input) => {
  if (input.Text) {
    return input.Text
  }
  if (input.Nat || input.Nat === 0 || input.Nat === BigInt(0)) {
    return Number(input.Nat)
  }
}

export default class Icrc1 implements TokenWrapper {
  standard = "ICRC1"

  actor: ActorSubclass<Icrc1Service>
  canisterId: string

  constructor(actor: ActorSubclass<Icrc1Service>, canisterId: string) {
    // super()

    this.actor = actor
    this.canisterId = canisterId
  }

  public async init() {

  }

  public async getMetadata() {
    /* Mock data */
    // const result = [
    //   ["icrc1:name", { "Text": "ICRC1 Token" }],
    //   ["icrc1:symbol", { "Text": "ICRC1" }],
    //   ["icrc1:decimals", { "Nat": "8" }],
    //   ["icrc1:fee", { "Nat": "0" }]
    // ]
    // const result = await this.actor.icrc1_metadata()
    // const details = result.reduce((acc, [key, value]) => ({
    //   ...acc,
    //   [key]: toValue(value),
    // }), {})
    //
    // const mintingAccount = (await this.actor.icrc1_minting_account())[0]
    // const totalSupply = await this.actor.icrc1_total_supply()
    const [mintingAccount, totalSupply, metadata] = await Promise.all([
      await this.actor.icrc1_minting_account(),
      await this.actor.icrc1_total_supply(),
      await this.actor.icrc1_metadata(),
    ])
    const details = metadata.reduce((acc, [key, value]) => ({
      ...acc,
      [key]: toValue(value),
    }), {})

    return {
      // TODO: ?
      feeTo: mintingAccount[0]!,
      standard: this.standard,
      symbol: details["icrc1:symbol"],
      name: details["icrc1:name"],
      decimals: details["icrc1:decimals"],
      fee: details["icrc1:fee"],
      totalSupply: Number(totalSupply),
      // TODO: ?
      owner: mintingAccount[0]!,
    }
  }

  // TODO: not supported
  // public async getHolders(start = 0, end = 999999999) {
  //   const holders = await this.actor.getHolders(BigInt(start), BigInt(end))
  //   return holders.map(holder => ({
  //     address: holder[0].toText(),
  //     balance: Number(holder[1]),
  //   }))
  // }

  async mint(receiver: Account, amount: number) {
    // TODO: sender should be minting account
    const mintResult = await this.actor.icrc1_transfer({
      to: receiver, // to : Account,
      fee: Opt(BigInt(0)), // fee : [] | [bigint],
      amount: BigInt(amount), // amount : bigint,
      memo: Opt(), // memo : [] | [Uint8Array],
      from_subaccount: [], // from_subaccount : [] | [Subaccount],
      created_at_time: [], // created_at_time : [] | [Timestamp],
    })
    if ("Err" in mintResult) {
      console.error(mintResult.Err)
    }
    if ("Ok" in mintResult) {
      return mintResult
    }
  }

  public async send(sendParams: SendParams) {
    const { to, amount, memo } = sendParams
    // TODO:
    const transferResult = await this.actor.icrc1_transfer({
      to: { owner: Principal.from(to), subaccount: [] }, // to : Account,
      fee: Opt(BigInt(0)), // fee : [] | [bigint],
      amount: BigInt(amount), // memo : [] | [Uint8Array],
      memo: Opt(memo), // from_subaccount : [] | [Subaccount],
      from_subaccount: [], // created_at_time : [] | [Timestamp],
      created_at_time: [], // amount : bigint,
    })

    if ("Ok" in transferResult) return { transactionId: transferResult.Ok.toString() }

    throw new Error(Object.keys(transferResult.Err)[0])
  }

  public async getBalance(user: Account) {
    // TODO: subaccount
    // TODO: remove decimals call?
    const decimals = await this.getDecimals()
    const value = await this.actor.icrc1_balance_of(user)
    return { value, decimals }
  }

  public async getDecimals() {
    return await this.actor.icrc1_decimals()
  }
}
