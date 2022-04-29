import AstroXConnector from "./AstroX"
import InternetIdentityConnector from "./InternetIdentity"
import PlugConnector from "./Plug"
import StoicConnector from "./Stoic"
import InfinityConnector from "./Infinity"
import NFIDConnector from "./NFID"
import EarthWalletConnector from "./EarthWallet"
import {
  astroXLogoLight,
  astroXLogoDark,
  dfinityLogoLight,
  dfinityLogoDark,
  infinityLogoLight,
  infinityLogoDark,
  nfidLogoLight,
  nfidLogoDark,
  plugLogoLight,
  plugLogoDark,
  stoicLogoLight,
  stoicLogoDark,
  earthLogoLight,
  earthLogoDark,
} from "../index"
// import { IConnector } from "./connectors"

// type ProviderOptions = {
//   connector: IConnector,
// }

const AstroX = {
  connector: AstroXConnector,
  icon: {
    light: astroXLogoLight,
    dark: astroXLogoDark,
  },
  id: "astrox",
  name: "AstroX ME",
}

const EarthWallet = {
  connector: EarthWalletConnector,
  icon: {
    light: earthLogoLight,
    dark: earthLogoDark,
  },
  id: "earth",
  name: "Earth Wallet",
}

const InfinityWallet = {
  connector: InfinityConnector,
  icon: {
    light: infinityLogoLight,
    dark: infinityLogoDark,
  },
  id: "infinity",
  name: "Infinity Wallet",
}

const InternetIdentity = {
  connector: InternetIdentityConnector,
  icon: {
    light: dfinityLogoLight,
    dark: dfinityLogoDark,
  },
  id: "ii",
  name: "Internet Identity",
}

const NFID = {
  connector: NFIDConnector,
  icon: {
    light: nfidLogoLight,
    dark: nfidLogoDark,
  },
  id: "nfid",
  name: "NFID",
}

const PlugWallet = {
  connector: PlugConnector,
  icon: {
    light: plugLogoLight,
    dark: plugLogoDark,
  },
  id: "plug",
  name: "Plug Wallet",
}

const Stoic = {
  connector: StoicConnector,
  icon: {
    light: stoicLogoLight,
    dark: stoicLogoDark,
  },
  id: "stoic",
  name: "Stoic Wallet",
}

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
  AstroXConnector,
  // EarthWalletConnector,
  InfinityConnector,
  InternetIdentityConnector,
  NFIDConnector,
  PlugConnector,
  StoicConnector,
}