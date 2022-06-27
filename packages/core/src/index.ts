import { createClient } from "./client"
import type { RootEvent, RootContext } from "./client"
import type { IConnector, IWalletConnector } from "./providers/connectors"
import type { ProviderOptions, Provider } from "./providers"

export type {
  RootEvent,
  RootContext,
  IConnector,
  IWalletConnector,
  ProviderOptions,
  Provider
}

export {
  createClient
}