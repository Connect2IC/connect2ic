import Connect from "./Connect"
import {
  PlugConnector,
  InternetIdentityConnector,
  AstroXConnector,
  StoicConnector,
  InfinityConnector,
  NFIDConnector,
} from "@connect2ic/core"

import IIButton from "./buttons/IIButton"
import PlugButton from "./buttons/PlugButton"
import AstroXButton from "./buttons/AstroXButton"
import StoicButton from "./buttons/StoicButton"
import InfinityButton from "./buttons/InfinityButton"
import NFIDButton from "./buttons/NFIDButton"
import Dialog from "./Dialog"
import { useConnect } from "./hooks/useConnect"
import { useCanister } from "./hooks/useCanister"
import { useWallet } from "./hooks/useWallet"
import { useBalance } from "./hooks/useBalance"
import { useDialog } from "./hooks/useDialog"
import { useProviders } from "./hooks/useProviders"
import { useSignMessage } from "./hooks/useSignMessage"
import { useTransfer } from "./hooks/useTransfer"
import { Connect2ICProvider, Connect2ICContext } from "./context"

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
  NFIDConnector,
  NFIDButton,
  InfinityConnector,
  InfinityButton,
  useConnect,
  useCanister,
  useBalance,
  useWallet,
  useDialog,
  useProviders,
  useSignMessage,
  useTransfer,
  Connect2ICProvider,
  Connect2ICContext,
}
