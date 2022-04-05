import Connect from "./Connect"
import { useConnect } from "./hooks/useConnect"
import Plug from "../core/connectors/Plug"
import PlugButton from "./buttons/PlugButton"
import II from "../core/connectors/InternetIdentity"
import IIButton from "./buttons/IIButton"
import AstroX from "../core/connectors/AstroX"
import AstroXButton from "./buttons/AstroXButton"
import Stoic from "../core/connectors/Stoic"
import StoicButton from "./buttons/StoicButton"
import Dialog from "./Dialog"
import { useCanister } from "./hooks/useCanister"
import { ConnectProvider, ConnectContext } from "./context"

export {
  Connect,
  Dialog,
  Plug,
  PlugButton,
  II,
  IIButton,
  AstroX,
  AstroXButton,
  Stoic,
  StoicButton,
  useConnect,
  useCanister,
  ConnectProvider,
  ConnectContext
}
