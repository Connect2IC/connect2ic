export interface IConnector {
  readonly id: string
  readonly name: string
  init: () => Promise<void>
  isAuthenticated: () => Promise<Boolean>
  createActor: (string, any) => Promise<any>
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

export interface IWalletConnector {
  // address: walletAddress,
  requestTransfer: (any) => Promise<any>
  queryBalance: (any) => Promise<any>
  signMessage: (any) => Promise<any>
  // getManagementCanister: (any) => Promise<any>
  // callClientRPC: (any) => Promise<any>
  // requestBurnXTC: (any) => Promise<any>
  // batchTransactions: (any) => Promise<any>
}

