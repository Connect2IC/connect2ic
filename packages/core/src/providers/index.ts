import { AstroX } from "./astrox"
import { InternetIdentity } from "./internet-identity"
import { PlugWallet } from "./plug-wallet"
import { StoicWallet } from "./stoic-wallet"
import { BitfinityWallet } from "./bitfinity-wallet"
import { NFID } from "./nfid"
import { Anonymous } from "./anonymous"
import { Ego } from "./ego"
import { ICX } from "./icx"

export type { IConnector } from "./connectors"
export * from "./connectors"

type Config = {
  whitelist?: Array<string>
  host?: string
  autoConnect?: boolean
  providerUrl?: string
  ledgerCanisterId?: string
  ledgerHost?: string
  appName?: string
  walletCanisterId?: string
}

let isICX = !!window.icx

export const defaultProviders = (config: Config) => {
  return isICX ? [new ICX(config)] : [
    new AstroX(config),
    new Ego(config),
    new BitfinityWallet(config),
    new InternetIdentity(config),
    new NFID(config),
    new PlugWallet(config),
    new StoicWallet(config),
  ]
}

export const walletProviders = (config: Config) => {
  return isICX ? [new ICX(config)] : [
    new AstroX(config),
    new PlugWallet(config),
  ]
}

export {
  Anonymous,
  AstroX,
  Ego,
  BitfinityWallet,
  InternetIdentity,
  NFID,
  PlugWallet,
  StoicWallet,
  ICX,
}
