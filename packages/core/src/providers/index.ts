import { AstroX } from "./astrox"
import { InternetIdentity } from "./internet-identity"
import { PlugWallet } from "./plug-wallet"
import { StoicWallet } from "./stoic-wallet"
import { InfinityWallet } from "./infinity-wallet"
import { NFID } from "./nfid"
import { EarthWallet } from "./earth-wallet"
import type { IConnector } from "./connectors"

type ProviderOptions = {
  connector: IConnector,
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

export const walletProviders: any = [
  AstroX,
  PlugWallet,
]

export {
  AstroX,
  EarthWallet,
  InfinityWallet,
  InternetIdentity,
  NFID,
  PlugWallet,
  StoicWallet,
}