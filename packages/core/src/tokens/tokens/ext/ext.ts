import { Actor, ActorSubclass } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"

import ExtService, { Metadata } from "./interfaces"
import {
  BalanceResponse,
  BurnParams,
  getDecimalsFromMetadata,
  InternalTokenMethods,
  SendParams,
  SendResponse,
} from "../methods"

type BaseExtService = ExtService;

const getMetadata = async (actor: ActorSubclass<BaseExtService>): Promise<Metadata> => {
  actor.balance
  const token = Actor.canisterIdOf(actor).toText()

  const extensions = await actor.extensions()
  if (!extensions.includes("@ext/common")) throw new Error("The provided canister does not implement commont extension")
  const metadataResult = await actor.metadata(token)

  if ("ok" in metadataResult) return metadataResult.ok

  throw new Error(Object.keys(metadataResult.err)[0])
}

const send = async (actor: ActorSubclass<BaseExtService>, { to, from, amount }: SendParams): Promise<SendResponse> => {
  const dummyMemmo = new Array(32).fill(0)
  const token = Actor.canisterIdOf(actor).toText()
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

  const transferResult = await actor.transfer(data)

  if ("ok" in transferResult) return { amount: transferResult.ok.toString() }

  throw new Error(Object.keys(transferResult.err)[0])
}

const getBalance = async (actor: ActorSubclass<BaseExtService>, user: Principal): Promise<BalanceResponse> => {
  const token = Actor.canisterIdOf(actor).toText()

  const balanceResult = await actor.balance({
    token,
    user: { principal: user },
  })

  const decimals = await getDecimals(actor)

  if ("ok" in balanceResult) return { value: balanceResult.ok.toString(), decimals }

  throw new Error(Object.keys(balanceResult.err)[0])
}

const burnXTC = async (_actor: ActorSubclass<BaseExtService>, _params: BurnParams) => {
  throw new Error("BURN NOT SUPPORTED")
}

const getDecimals = async (actor: ActorSubclass<BaseExtService>) => getDecimalsFromMetadata(await getMetadata(actor))

export default {
  send,
  getMetadata,
  getBalance,
  burnXTC,
  getDecimals,
} as InternalTokenMethods
