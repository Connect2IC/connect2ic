import { AstroX } from "./astrox/connector"
import { InternetIdentity } from "./internet-identity/connector"
import { PlugWallet } from "./plug-wallet/connector"
import { StoicWallet } from "./stoic-wallet/connector"
import { InfinityWallet } from "./infinity-wallet/connector"
import { NFID } from "./nfid/connector"
import { Anonymous } from "./anonymous/connector"
import { ICX } from "./icx/connector"
// import { EarthWallet } from "./earth-wallet"
import type { IConnector, IWalletConnector } from "./connectors"

export * from "./connectors"
export type Provider = IConnector & Partial<IWalletConnector>
export type WalletProvider = IConnector & IWalletConnector

type Config = {
  ic: {
    whitelist?: Array<string>
    host?: string
    autoConnect?: boolean
    providerUrl?: string
    ledgerCanisterId?: string
    ledgerHost?: string
    appName?: string
  },
  local: {
    whitelist?: Array<string>
    host?: string
    autoConnect?: boolean
    providerUrl?: string
    ledgerCanisterId?: string
    ledgerHost?: string
    appName?: string
  }
}

let isICX = !!window.icx

export const defaultProviders: (config: Config) => Array<Provider> = (config) => {
  return isICX ? [new ICX(config)] : [
    new AstroX(config),
    // EarthWallet,
    new InfinityWallet(config),
    new InternetIdentity(config),
    new NFID(config),
    new PlugWallet(config),
    new StoicWallet(config),
  ]
}

export const walletProviders: (Config) => Array<WalletProvider> = (config) => {
  return isICX ? [new ICX(config)] : [
    new AstroX(config),
    new PlugWallet(config),
  ]
}

export {
  Anonymous,
  AstroX,
  // EarthWallet,
  InfinityWallet,
  InternetIdentity,
  NFID,
  PlugWallet,
  StoicWallet,
  ICX,
}