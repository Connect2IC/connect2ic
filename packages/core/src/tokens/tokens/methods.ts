import { ActorSubclass } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"

import { Metadata } from "./ext/interfaces"
import { BurnResult } from "./xtc/interfaces"

interface TimeStamp {
  timestamp_nanos: bigint;
}

export interface SendOpts {
  fee?: bigint;
  memo?: string;
  from_subaccount?: number;
  created_at_time?: TimeStamp; // TODO: create js Date to TimeStamp function
}

export type SendResponse = { height: string } | { amount: string } | { transactionId: string };

export interface SendParams {
  to: string;
  from: string;
  amount: bigint;
  opts?: any;
}

export interface BurnParams {
  to: Principal;
  amount: string;
}

export interface BalanceResponse {
  value: string;
  decimals: number;
  error?: string;
}

interface AddedMehtodsToken {
  send: ({ to, from, amount }: SendParams) => Promise<SendResponse>;
  getMetadata: () => Promise<Metadata>;
  getBalance: (user: Principal) => Promise<BalanceResponse>;
  burnXTC: ({ to, amount }: BurnParams) => Promise<BurnResult>;
  getDecimals: () => Promise<number>;
}

export type TokenServiceExtended<T> = T & AddedMehtodsToken;

export interface InternalTokenMethods {
  send: (actor: ActorSubclass<any>, { to, from, amount }: SendParams) => Promise<SendResponse>;
  getMetadata: (actor: ActorSubclass<any>) => Promise<Metadata>;
  getBalance: (actor: ActorSubclass<any>, user: Principal) => Promise<BalanceResponse>;
  burnXTC: (actor: ActorSubclass<any>, { to, amount }: BurnParams) => Promise<BurnResult>;
  getDecimals: (actor: ActorSubclass<any>) => Promise<number>;
}

const send = async (_actor: ActorSubclass<any>, _params: SendParams): Promise<SendResponse> => {
  throw Error("Standard Not Implemented")
}

const getMetadata = async (_actor: ActorSubclass<any>): Promise<Metadata> => {
  throw Error("Standard Not Implemented")
}

const getBalance = async (_actor: ActorSubclass<any>, _user: Principal): Promise<BalanceResponse> => {
  throw Error("Standard Not Implemented")
}

const burnXTC = async (_actor: ActorSubclass<any>, _params: BurnParams) => {
  throw Error("Standard Not Implemented")
}

const getDecimals = async (_actor: ActorSubclass<any>) => {
  throw Error("Standard Not Implemented")
}

export const getDecimalsFromMetadata = (metadata: Metadata): number => {
  return "fungible" in metadata ? metadata.fungible.decimals : 0
}

export const parseAmountToSend = (amount: string, decimals: number): bigint => {
  return BigInt(parseFloat(amount) * 10 ** decimals)
}

export default {
  send,
  getMetadata,
  getBalance,
  burnXTC,
  getDecimals,
} as InternalTokenMethods
