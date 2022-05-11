import {AstroX} from "./astrox"
import {InternetIdentity} from "./internet-identity"
import {PlugWallet} from "./plug-wallet"
import {StoicWallet} from "./stoic-wallet"
import {InfinityWallet} from "./infinity-wallet"
import {NFID} from "./nfid"
// import EarthWallet from "./EarthWallet"
// import { IConnector } from "./connectors"

// type ProviderOptions = {
//   connector: IConnector,
// }

export const defaultProviders: any = [
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
  // EarthWalletConnector,
  InfinityWallet,
  InternetIdentity,
  NFID,
  PlugWallet,
  StoicWallet,
}