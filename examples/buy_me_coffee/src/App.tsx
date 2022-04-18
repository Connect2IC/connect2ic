import { walletConnectors, defaultConnectors } from "@connect2ic/core"
import { Connect2ICProvider } from "@connect2ic/react"
import * as buymeacoffee from "@/canisters/buymecoffee"
import { MainLayout } from "./pages/Layout/MainLayout"

const canisters = {
  buymeacoffee: {
    ...buymeacoffee,
    canisterId: process.env.CANISTER_ID,
  },
}

const App: React.FC = () => (
  <Connect2ICProvider connectors={walletConnectors} canisters={canisters}>
    <MainLayout />
  </Connect2ICProvider>
)

export default App
