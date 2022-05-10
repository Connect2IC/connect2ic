import * as AstroX from "./AstroX"
import * as InternetIdentity from "./InternetIdentity"
import * as PlugWallet from "./Plug"
import * as Stoic from "./Stoic"
import * as InfinityWallet from "./Infinity"
import * as NFID from "./NFID"
// import EarthWallet from "./EarthWallet"
// import { IConnector } from "./connectors"

// type ProviderOptions = {
//   connector: IConnector,
// }

export const defaultProviders = [
  AstroX,
  // EarthWallet,
  InfinityWallet,
  InternetIdentity,
  NFID,
  PlugWallet,
  Stoic,
]

export const walletProviders = [
  AstroX,
  InfinityWallet,
  PlugWallet,
]

export {
  AstroX,
  // EarthWalletConnector,
  InfinityWallet,
  InternetIdentity,
  NFID,
  PlugWallet,
  Stoic,
}