import astroXLogoDark from "./assets/astrox.png"
import astroXLogoLight from "./assets/astrox_light.svg"
import dfinityLogoLight from "./assets/dfinity.svg"
import dfinityLogoDark from "./assets/dfinity.svg"
import plugLogoLight from "./assets/plugLight.svg"
import plugLogoDark from "./assets/plugDark.svg"
import stoicLogoLight from "./assets/stoic.png"
import stoicLogoDark from "./assets/stoic.png"
import infinityLogoLight from "./assets/infinity.png"
import infinityLogoDark from "./assets/infinity.png"
import nfidLogoLight from "./assets/nfid.png"
import nfidLogoDark from "./assets/nfid.png"
import earthLogoLight from "./assets/earth.png"
import earthLogoDark from "./assets/earth.png"
import { connectMachine } from "./machines/connectMachine"
import * as canisters from "../canisters"
import * as connectors from "./connectors"
// import { IConnector } from "./connectors"

// type ProviderOptions = {
//   connector: IConnector,
// }

const AstroX = {
  connector: connectors.AstroXConnector,
  icon: {
    light: astroXLogoLight,
    dark: astroXLogoDark,
  },
  id: "astrox",
  name: "AstroX ME",
}

// const EarthWallet = {
//   connector: connectors.EarthWalletConnector,
//   icon: {
//     light: earthLogoLight,
//     dark: earthLogoDark,
//   },
//   id: "earth",
//   name: "Earth Wallet",
// }

const InfinityWallet = {
  connector: connectors.InfinityConnector,
  icon: {
    light: infinityLogoLight,
    dark: infinityLogoDark,
  },
  id: "infinity",
  name: "Infinity Wallet",
}

const InternetIdentity = {
  connector: connectors.InternetIdentityConnector,
  icon: {
    light: dfinityLogoLight,
    dark: dfinityLogoDark,
  },
  id: "ii",
  name: "Internet Identity",
}

const NFID = {
  connector: connectors.NFIDConnector,
  icon: {
    light: nfidLogoLight,
    dark: nfidLogoDark,
  },
  id: "nfid",
  name: "NFID",
}

const PlugWallet = {
  connector: connectors.PlugConnector,
  icon: {
    light: plugLogoLight,
    dark: plugLogoDark,
  },
  id: "plug",
  name: "Plug Wallet",
}

const Stoic = {
  connector: connectors.StoicConnector,
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

// TODO: add to package.json
// "./providers/astrox": {
//   "module": "./providers/astrox/dist/providers-astrox.esm.js",
//     "default": "./providers/astrox/dist/providers-astrox.cjs.js"
// },
export * from "./connectors"
export {
  canisters,
  astroXLogoLight,
  astroXLogoDark,
  dfinityLogoLight,
  dfinityLogoDark,
  plugLogoDark,
  plugLogoLight,
  stoicLogoLight,
  stoicLogoDark,
  infinityLogoLight,
  infinityLogoDark,
  nfidLogoLight,
  nfidLogoDark,
  earthLogoLight,
  earthLogoDark,
  connectMachine,
}