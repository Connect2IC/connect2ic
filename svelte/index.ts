import Connect from "./Connect.svelte"
import Plug from "../providers/Plug"
import createAuth from "./Auth.store"
import PlugButton from "./buttons/PlugButton.svelte"
import II from "../providers/InternetIdentity"
import IIButton from "./buttons/IIButton.svelte"
// import AstroX from "../providers/AstroX"
// import AstroXButton from "./buttons/AstroXButton.tsx"
import Stoic from "../providers/Stoic"
import StoicButton from "./buttons/StoicButton.svelte"
import MetamaskButton from "./buttons/MetamaskButton.svelte"
import Metamask from "../providers/Metamask"
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
  Metamask,
  MetamaskButton,
  Stoic,
  StoicButton,
  createAuth,
}