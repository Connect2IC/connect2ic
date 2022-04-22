import AstroXConnector from "./AstroX"
import InternetIdentityConnector from "./InternetIdentity"
import PlugConnector from "./Plug"
import StoicConnector from "./Stoic"
import InfinityConnector from "./Infinity"
import NFIDConnector from "./NFID"

export const defaultConnectors = (config) => [
  new AstroXConnector(config),
  new InfinityConnector(config),
  new InternetIdentityConnector(config),
  new NFIDConnector(config),
  new PlugConnector(config),
  new StoicConnector(config),
]

export const walletConnectors = (config) => [
  new AstroXConnector(config),
  new InfinityConnector(config),
  new PlugConnector(config),
]

export {
  AstroXConnector,
  InfinityConnector,
  InternetIdentityConnector,
  NFIDConnector,
  PlugConnector,
  StoicConnector,
}