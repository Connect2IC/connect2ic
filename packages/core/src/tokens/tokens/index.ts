import { ActorSubclass, HttpAgent } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"
import { IDL } from "@dfinity/candid"

import { createExtendedActorClass } from "../dab_utils/actorFactory"
import defaultMethods, { BalanceResponse, InternalTokenMethods, TokenServiceExtended } from "./methods"
import xtcMethods from "./xtc/xtc"
import extMethods from "./ext/ext"
import dip20Methods from "./dip20/dip20"
import extIDL from "./ext/ext.did"
import xtcIDL from "./xtc/xtc.did"
import dip20IDL from "./dip20/dip20.did"
import icpIDL from "./ledger/ledger.did"
import { TOKEN } from "../constants/standards"
import wicpIDL from "./wicp/wicp.did"
import wicpMethods from "./wicp/wicp"
import icpMethods from "./ledger/ledger"
import icpStandardMethods from "./ledger/ledgerStandardMethods"

export const getMethods = (standard: string): InternalTokenMethods =>
  ({
    [TOKEN.xtc]: xtcMethods,
    [TOKEN.ext]: extMethods,
    [TOKEN.dip20]: dip20Methods,
    [TOKEN.wicp]: wicpMethods,
    [TOKEN.icp]: icpStandardMethods,
  }[standard] || defaultMethods)

export const getIdl = (standard: string): IDL.InterfaceFactory => {
  const idl = {
    [TOKEN.xtc]: xtcIDL,
    [TOKEN.ext]: extIDL,
    [TOKEN.dip20]: dip20IDL,
    [TOKEN.wicp]: wicpIDL,
    [TOKEN.icp]: icpIDL,
  }[standard]
  if (!idl) throw new Error(`Standard ${standard} Not Implemented`)
  return idl
}

// TODO: ??
export const createTokenActor = async <T>(
  canisterId: string | Principal,
  agent: HttpAgent,
  standard: string,
): Promise<ActorSubclass<TokenServiceExtended<T>>> => {
  const idl = getIdl(standard)

  const actor = (new (createExtendedActorClass(
    agent,
    canisterId === "ryjl3-tyaaa-aaaaa-aaaba-cai" ? icpMethods : getMethods(standard),
    canisterId,
    idl,
  ))() as unknown) as ActorSubclass<TokenServiceExtended<any>>
  return actor
}

export const parseBalance = (balance: BalanceResponse): string => {
  return (parseInt(balance.value, 10) / 10 ** balance.decimals).toString()
}

export default {}

export type { SendResponse } from "./methods"
