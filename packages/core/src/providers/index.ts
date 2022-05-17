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
  icon: any,
  id: string,
  name: string,
}

export type Provider = {
  connector: IConnector & Partial<IWalletConnector>
  icon: any,
  id: string,
  name: string,
}

export const defaultProviders: Array<ProviderOptions> = [
  AstroX,
  // EarthWallet,
  InfinityWallet,
  InternetIdentity,
  NFID,
  PlugWallet,
  StoicWallet,
]

export const walletProviders: Array<ProviderOptions> = [
  AstroX,
  PlugWallet,
]

export {
  AstroX,
  // EarthWallet,
  InfinityWallet,
  InternetIdentity,
  NFID,
  PlugWallet,
  StoicWallet,
}