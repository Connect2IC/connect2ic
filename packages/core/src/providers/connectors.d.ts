export interface IConnector {
  init: () => Promise<void>
  isConnected: () => Promise<Boolean>
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

// type ProviderOptions = {
//   connector: IConnector,
// }

