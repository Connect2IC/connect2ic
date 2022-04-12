import AstroXConnector from "./AstroX"
import InternetIdentityConnector from "./InternetIdentity"
import PlugConnector from "./Plug"
import StoicConnector from "./Stoic"
import InfinityConnector from "./Infinity"

export const defaultConnectors = [
  AstroXConnector,
  InfinityConnector,
  InternetIdentityConnector,
  PlugConnector,
  StoicConnector,
]

export const walletConnectors = [
  AstroXConnector,
  InfinityConnector,
  PlugConnector,
]

export {
  AstroXConnector,
  InfinityConnector,
  InternetIdentityConnector,
  PlugConnector,
  StoicConnector,
}