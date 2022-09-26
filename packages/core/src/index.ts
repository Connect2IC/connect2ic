import { createClient } from "./client"
import type { Client } from "./client"
import type { RootEvent, RootContext } from "./client"
import type { Provider } from "./providers"

// TODO: separate?
// tokens
export { getIdl, getMethods } from "./tokens/tokens"
export type { InternalTokenMethods } from "./tokens/tokens/methods"

export {
  InitError,
  CreateActorError,
  TransferError,
  BalanceError,
  DisconnectError,
  ConnectError,
} from "./providers/connectors"
export type {
  IWalletConnector,
  IConnector,
  CreateActorResult,
  InitResult,
  BalanceResult,
  ConnectResult,
  DisconnectResult,
  TransferResult,
} from "./providers/connectors"

export type {
  RootEvent,
  RootContext,
  Provider,
  Client,
}

export {
  createClient,
}