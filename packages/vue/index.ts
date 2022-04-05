import Connect from "./Connect.vue"
import Plug from "../core/connectors/Plug"
import useAuth from "./useAuth"
import PlugButton from "./buttons/PlugButton.vue"
import II from "../core/connectors/InternetIdentity"
import IIButton from "./buttons/IIButton.vue"
// import AstroX from "../providers/AstroX"
// import AstroXButton from "./buttons/AstroXButton.tsx"
import Stoic from "../core/connectors/Stoic"
import StoicButton from "./buttons/StoicButton.vue"
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
  Stoic,
  StoicButton,
  useAuth,
}