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

type BaseWICPService = WICPService;

const getMetadata = async (actor: ActorSubclass<BaseWICPService>): Promise<Metadata> => {
  const metadataResult = await actor.getMetadata()
  return {
    fungible: {
      symbol: metadataResult.symbol,
      decimals: metadataResult.decimals,
      name: metadataResult.name,
    },
  }
}

const send = async (actor: ActorSubclass<BaseWICPService>, { to, amount }: SendParams): Promise<SendResponse> => {
  const transferResult = await actor.transfer(Principal.fromText(to), amount)

  if ("Ok" in transferResult) return { transactionId: transferResult.Ok.toString() }

  throw new Error(Object.keys(transferResult.Err)[0])
}

const getBalance = async (actor: ActorSubclass<BaseWICPService>, user: Principal): Promise<BalanceResponse> => {
  const decimals = await getDecimals(actor)
  const value = (await actor.balanceOf(user)).toString()
  return { value, decimals }
}

const burnXTC = async (_actor: ActorSubclass<BaseWICPService>, _params: BurnParams) => {
  throw new Error("BURN NOT SUPPORTED")
}

const getDecimals = async (actor: ActorSubclass<BaseWICPService>) => getDecimalsFromMetadata(await getMetadata(actor))

export default {
  send,
  getMetadata,
  getBalance,
  burnXTC,
  getDecimals,
} as InternalTokenMethods
