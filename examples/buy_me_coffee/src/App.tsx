import { walletConnectors, defaultConnectors } from "@connect2ic/core"
import { ConnectProvider } from "@connect2ic/react"
import * as buymeacoffee from "@/canisters/buymecoffee"
import { MainLayout } from "./pages/Layout/MainLayout"

const canisters = {
  buymeacoffee: {
    ...buymeacoffee,
    canisterId: process.env.CANISTER_ID,
  },
}

const App: React.FC = () => (
  <ConnectProvider connectors={walletConnectors} canisters={canisters}>
    <MainLayout />
  </ConnectProvider>
)

export default App
