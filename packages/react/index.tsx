import Connect from "./Connect"
import {
  PlugConnector,
  InternetIdentityConnector,
  AstroXConnector,
  StoicConnector,
  InfinityConnector
} from "@connect2ic/core"

import IIButton from "./buttons/IIButton"
import PlugButton from "./buttons/PlugButton"
import AstroXButton from "./buttons/AstroXButton"
import StoicButton from "./buttons/StoicButton"
import InfinityButton from "./buttons/InfinityButton"
import Dialog from "./Dialog"
import { useConnect } from "./hooks/useConnect"
import { useCanister } from "./hooks/useCanister"
import { useWallet } from "./hooks/useWallet"
import { ConnectProvider, ConnectContext } from "./context"

export {
  Connect,
  Dialog,
  PlugConnector,
  PlugButton,
  InternetIdentityConnector,
  IIButton,
  AstroXConnector,
  AstroXButton,
  StoicConnector,
  StoicButton,
  InfinityConnector,
  InfinityButton,
  useConnect,
  useCanister,
  useWallet,
  ConnectProvider,
  ConnectContext
}
