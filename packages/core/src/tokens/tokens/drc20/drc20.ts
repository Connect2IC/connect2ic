/* eslint-disable @typescript-eslint/camelcase */
import { Principal } from "@dfinity/principal"
import { ActorSubclass } from "@dfinity/agent"

import { _SERVICE as Drc20Service, TransferArgs } from "./interfaces"
import { Metadata } from "../ext/interfaces"
import {
  BalanceResponse,
  BurnParams,
  getDecimalsFromMetadata,
  InternalTokenMethods,
  SendParams,
  SendResponse,
} from "../methods"
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

export default class Drc20 implements TokenWrapper {
  standard = "DRC20"

  actor: ActorSubclass<Drc20Service>
  canisterId: string

  constructor({ actor, canisterId }: { actor: ActorSubclass<Drc20Service>, canisterId: string }) {
    // super()
    this.actor = actor
    this.canisterId = canisterId
  }

  public async getMetadata() {
    /* Mock data */
    // const result = [
    //   ["icrc1:symbol", { "Text": "ICRC1" }],
    //   ["icrc1:name", { "Text": "ICRC1 Token" }],
    //   ["icrc1:decimals", { "Nat": "8" }],
    //   ["icrc1:fee", { "Nat": "0" }],
    //   ["icrc1:totalSupply", { "Nat": "100000000" }],
    //   ["drc20:height", { "Nat": "1" }],
    //   ["drc20:holders", { "Nat": "1" }]
    // ]
    const metadata = await this.actor.icrc1_metadata()
    const details = metadata.reduce((acc, [key, value]) => ({
      ...acc,
      [key]: toValue(value),
    }), {})

    const mintingAccountResult = (await this.actor.icrc1_minting_account())[0]
    // const mintingAccount = { owner: mintingAccountResult.owner, subaccount: mintingAccountResult.subaccount[0] }
    // // TODO: handle subaccount
    // const mintingPrincipal = mintingAccount
    // const mintingSubAccount = mintingAccount.subaccount[0]
    return {
      // cycles: Number(details.cycles),
      // deployTime: Number(details.deployTime),
      // TODO:?
      feeTo: mintingAccountResult,
      // historySize: Number(details.historySize),
      holderNumber: details["drc20:holders"],
      standard: this.standard,
      symbol: details["icrc1:symbol"],
      name: details["icrc1:name"],
      decimals: details["icrc1:decimals"],
      fee: details["icrc1:fee"],
      totalSupply: details["icrc1:totalSupply"],
      // TODO:?
      owner: mintingAccountResult,
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

  async mint(receiver: Account, amount: number): Promise<any> {
    // TODO: sender should be minting account
    const mintResult = await this.actor.icrc1_transfer({
      to: receiver, // to : Account,
      fee: Opt(BigInt(0)), // fee : [] | [bigint],
      amount: BigInt(amount), // memo : [] | [Uint8Array],
      memo: [], // from_subaccount : [] | [Subaccount],
      from_subaccount: [], // created_at_time : [] | [Timestamp],
      created_at_time: [], // amount : bigint,
    } as TransferArgs)
    if ("Err" in mintResult) {
      console.error(mintResult.Err)
    }
    if ("Ok" in mintResult) {
      return mintResult
    }
  }

  public async send(sendParams: SendParams): Promise<SendResponse> {
    const { to, amount, memo } = sendParams
    // TODO:
    const transferResult = await this.actor.icrc1_transfer({
      to: { owner: Principal.from(to), subaccount: [] }, // to : Account,
      fee: Opt(BigInt(0)), // fee : [] | [bigint],
      amount: BigInt(amount), // memo : [] | [Uint8Array],
      memo: memo ?? [], // from_subaccount : [] | [Subaccount],
      from_subaccount: [], // created_at_time : [] | [Timestamp],
      created_at_time: [], // amount : bigint,
    } as TransferArgs)

    if ("Ok" in transferResult) return { transactionId: transferResult.Ok.toString() }

    throw new Error(Object.keys(transferResult.Err)[0])
  }

  public async getBalance(user: Account) {
    // TODO: remove decimals call?
    const decimals = await this.getDecimals()
    const value = await this.actor.icrc1_balance_of(user)
    return { value, decimals }
  }

  public async getDecimals() {
    return await this.actor.icrc1_decimals()
  }
}
