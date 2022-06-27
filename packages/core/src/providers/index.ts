import { AstroX } from "./astrox"
import { InternetIdentity } from "./internet-identity"
import { PlugWallet } from "./plug-wallet"
import { StoicWallet } from "./stoic-wallet"
import { InfinityWallet } from "./infinity-wallet"
import { NFID } from "./nfid"
// import { EarthWallet } from "./earth-wallet"
import type { IConnector, IWalletConnector } from "./connectors"

type ConnectorClass = { new(...args: any[]): IConnector & Partial<IWalletConnector>; };

export type ProviderOptions = {
  connector: ConnectorClass,
  features: Array<string>,
  icon: any,
  id: string,
  name: string,
}

export type Provider = {
  connector: IConnector & Partial<IWalletConnector>
  features: Array<string>,
  icon: any,
  id: string,
  name: string,
}

type Config = {
  whitelist: Array<string>
  host?: string
  dev?: boolean
  autoConnect?: boolean
  providerUrl: string
  ledgerCanisterId: string
  ledgerHost?: string
  appName?: string
}

export const defaultProviders: (config: Config) => Array<Provider> = (config) => {
  return [
    new AstroX(config),
    // EarthWallet,
    new InfinityWallet(config),
    new InternetIdentity(config),
    new NFID(config),
    new PlugWallet(config),
    new StoicWallet(config),
  ]
}

export const walletProviders: (Config) => Array<Provider> = (config) => {
  return [
    new AstroX(config),
    new PlugWallet(config),
  ]
}

export {
  AstroX,
  // EarthWallet,
  InfinityWallet,
  InternetIdentity,
  NFID,
  PlugWallet,
  StoicWallet,
}