import AstroXConnector from "./AstroX"
import InternetIdentityConnector from "./InternetIdentity"
import PlugConnector from "./Plug"
import StoicConnector from "./Stoic"
import InfinityConnector from "./Infinity"

export const defaultConnectors = [
  AstroXConnector,
  InternetIdentityConnector,
  PlugConnector,
  StoicConnector,
  InfinityConnector,
]

export const walletConnectors = [
  AstroXConnector,
  PlugConnector,
  InfinityConnector,
]

export {
  AstroXConnector,
  InternetIdentityConnector,
  PlugConnector,
  StoicConnector,
  InfinityConnector,
}