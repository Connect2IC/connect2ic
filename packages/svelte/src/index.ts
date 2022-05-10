import Connect from "./Connect.svelte"
import Plug from "../core/connectors/Plug"
import createAuth from "./Auth.store"
import PlugButton from "./buttons/PlugButton.svelte"
import II from "../core/connectors/InternetIdentity"
import IIButton from "./buttons/IIButton.svelte"
import AstroX from "../core/connectors/AstroX"
import AstroXButton from "./buttons/AstroXButton.svelte"
import Stoic from "../core/connectors/Stoic"
import StoicButton from "./buttons/StoicButton.svelte"
import Dialog from "./Dialog.svelte"

export {
  Connect,
  Dialog,
  Plug,
  PlugButton,
  II,
  IIButton,
  // AstroX,
  // AstroXButton,
  Stoic,
  StoicButton,
  createAuth,
}