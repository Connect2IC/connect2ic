import Emitter from "event-e3"
import type { IConnector } from "./providers"
import { PROVIDER_STATUS, Anonymous } from "./providers"
import { QueryClient } from "@tanstack/query-core"

type Config = {
  providers: Array<IConnector>
  whitelist?: Array<string>
  host?: string
  autoConnect?: boolean
  providerUrl?: string
  ledgerCanisterId?: string
  ledgerHost?: string
  appName?: string
  queryClient?: QueryClient
}

enum CLIENT_STATUS {
  INACTIVE = "inactive",
  INITIALIZING = "initializing",
  IDLE = "idle",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  LOCKED = "locked",
  DISCONNECTING = "disconnecting",
}

type State = {
  providers: Array<IConnector>
  status: CLIENT_STATUS
  activeProvider: IConnector | undefined
  connectingProvider: IConnector | undefined
  anonymousProvider: Anonymous
  listeners: Array<() => void>
}


class Store<State extends Record<string, any>> {
  private subscribers = new Set<any>()

  constructor(private state: State) {
  }

  getValue() {
    return this.state
  }

  setValue(newState: State | ((state: State) => State)) {
    this.state = typeof newState === "function" ?
      newState(this.state) : newState
    this.emit()
  }

  updateValue(partialState: Partial<State>) {
    this.state = { ...this.state, ...partialState }
    this.emit()
  }

  subscribe(subscriber) {
    this.subscribers.add(subscriber)

    return () => this.subscribers.delete(subscriber)
  }

  private emit() {
    this.subscribers.forEach((subscriber) => subscriber(this.state))
  }
}

const createClient = (config: Config) => {
  const {
    providers = [],
    host = window.location.origin,
    queryClient = new QueryClient({
      // TODO: check
      defaultOptions: {
        queries: {
          cacheTime: 1_000 * 60 * 60 * 24, // 24 hours
          networkMode: "offlineFirst",
          refetchOnWindowFocus: false,
          retry: 0,
        },
        mutations: {
          networkMode: "offlineFirst",
        },
      },
    }),
  } = config
  let _store = new Store<State>({
    providers,
    status: CLIENT_STATUS.INACTIVE,
    activeProvider: undefined,
    connectingProvider: undefined,
    anonymousProvider: new Anonymous(config),
    listeners: [],
  })
  const _emitter = new Emitter()

  const self = {
    async init() {
      _store.updateValue({ status: CLIENT_STATUS.INITIALIZING })

      await Promise.all([
        ..._store.getValue().providers.map(p => p.init()),
        _store.getValue().anonymousProvider.init(),
      ])

      try {
        let connectedProvider
        let connectedProviderStatus
        for (const provider of _store.getValue().providers) {
          const providerStatus = await provider.status()
          if (providerStatus === PROVIDER_STATUS.CONNECTED) {
            connectedProvider = provider
            connectedProviderStatus = providerStatus
            break
          } else if (providerStatus === PROVIDER_STATUS.LOCKED) {
            connectedProvider = provider
            connectedProviderStatus = providerStatus
            break
          }
        }
        if (connectedProviderStatus === PROVIDER_STATUS.LOCKED) {
          _store.updateValue({
            activeProvider: connectedProvider,
            status: CLIENT_STATUS.LOCKED,
          })
        } else if (connectedProviderStatus === PROVIDER_STATUS.CONNECTED) {
          _store.updateValue({
            activeProvider: connectedProvider,
            status: CLIENT_STATUS.CONNECTED,
          })
        } else {
          _store.updateValue({ status: CLIENT_STATUS.IDLE })
        }
      } catch (e) {
        _store.updateValue({ status: CLIENT_STATUS.IDLE })
      } finally {
        _emitter.emit("init", { providers: self.providers })
      }
    },

    on(evt, fn) {
      _emitter.on(evt, fn)
      return () => _emitter.off(evt, fn)
    },

    async connect(providerId) {
      _store.updateValue({
        status: CLIENT_STATUS.CONNECTING,
        connectingProvider: providerId,
      })
      _emitter.emit("connecting", {})
      try {
        const provider = _store.getValue().providers.find(p => p.meta.id === providerId)
        await provider!.connect()
        _store.updateValue({
          status: CLIENT_STATUS.CONNECTED,
          activeProvider: _store.getValue().providers[providerId],
        })
        _emitter.emit("connect", {
          activeProvider: self.activeProvider,
          principal: self.principal,
        })
      } catch (e) {
        _store.updateValue({ status: CLIENT_STATUS.IDLE })
        _emitter.emit("idle", {})
      } finally {
        _store.updateValue({ connectingProvider: undefined })
      }
    },

    cancelConnect() {
      _store.updateValue({
        status: CLIENT_STATUS.IDLE,
        activeProvider: undefined,
      })
      _emitter.emit("idle", {})
    },

    async disconnect() {
      if (_store.getValue().status !== CLIENT_STATUS.CONNECTED) {
        return
      }
      _store.updateValue({ status: CLIENT_STATUS.DISCONNECTING })
      try {
        await self.activeProvider?.disconnect()
        _store.updateValue({
          status: CLIENT_STATUS.IDLE,
          activeProvider: undefined,
        })
      } catch (e) {
        _store.updateValue({ status: CLIENT_STATUS.CONNECTED })
      } finally {
      }
    },

    async createActor(canisterId, interfaceFactory) {
      if (!self.activeProvider) {
        return
      }
      return await _store.getValue().activeProvider!.createActor(
        canisterId,
        interfaceFactory,
      )
    },

    async createAnonymousActor(canisterId, interfaceFactory) {
      return await _store.getValue().anonymousProvider.createActor(
        canisterId,
        interfaceFactory,
      )
    },

    get providers() {
      return _store.getValue().providers
    },

    get principal() {
      return _store.getValue().activeProvider?.principal
    },

    get activeProvider() {
      return _store.getValue().activeProvider
    },

    get anonymousProvider() {
      return _store.getValue().anonymousProvider
    },

    get status() {
      return _store.getValue().status
    },

    get queryClient() {
      return queryClient
    },

    subscribe(listener) {
      return _store.subscribe(listener)
    },

    getSnapshot() {
      return _store.getValue()
    },
  }
  return self
}


export { CLIENT_STATUS, createClient }
