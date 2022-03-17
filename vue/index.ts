import Connect from "./Connect.vue"
import Plug from "../providers/Plug"
import useAuth from "./useAuth"
import PlugButton from "./buttons/PlugButton.vue"
import II from "../providers/InternetIdentity"
import IIButton from "./buttons/IIButton.vue"
// import AstroX from "../providers/AstroX"
// import AstroXButton from "./buttons/AstroXButton.tsx"
import Stoic from "../providers/Stoic"
import StoicButton from "./buttons/StoicButton.vue"
import MetamaskButton from "./buttons/MetamaskButton.vue"
import Metamask from "../providers/Metamask"
import Dialog from "./Dialog.vue"

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
  useAuth,
}