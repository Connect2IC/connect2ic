const name = "plug"

const Plug = async (config = {
  whitelist: [],
  host: window.location.origin,
}) => {
  let state
  const connected = await window.ic.plug.isConnected()
  const thisIC = window.ic.plug
  if (connected) {
    try {
      await window.ic.plug.createAgent(config)
      // TODO: never finishes if user doesnt login back
      let principal = await (await window.ic.plug.getPrincipal()).toString()

      // TODO: return identity?
      // const walletAddress = thisIC.wallet
      const wallet = {
        // address: walletAddress,
        requestTransfer: (...args) => thisIC.requestTransfer(...args),
        queryBalance: (...args) => thisIC.requestBalance(...args),
        signMessage: (...args) => thisIC.signMessage(...args),
        getManagementCanister: (...args) => thisIC.getManagementCanister(...args),
        callClientRPC: (...args) => thisIC.callClientRPC(...args),
        requestBurnXTC: (...args) => thisIC.requestBurnXTC(...args),
        batchTransactions: (...args) => thisIC.batchTransactions(...args),
      }
      state = {
        principal,
        // TODO: fix
        wallet,
        signedIn: true,
        provider: {
          name,
          ic: window.ic.plug,
        },
      }
    } catch (e) {
      console.error(e)
    }
  }



  return {
    state,
    name,
    createActor: async (canisterId, idlFactory) => {
      // // Fetch root key for certificate validation during development
      // // if(process.env.NODE_ENV !== "production") {
      await window.ic.plug.agent.fetchRootKey()
      // // }

      return await window.ic.plug.createActor({ canisterId, interfaceFactory: idlFactory })
    },
    connect: async () => {
      try {
        await window.ic.plug.requestConnect(config)
        const thisIC = window.ic.plug
        let principal = await (await thisIC.getPrincipal()).toString()
        // TODO: return identity?
        // const walletAddress = thisIC.wallet
        const wallet = {
          // address: walletAddress,
          requestTransfer: (...args) => thisIC.requestTransfer(...args),
          queryBalance: (...args) => thisIC.requestBalance(...args),
          signMessage: (...args) => thisIC.signMessage(...args),
          getManagementCanister: (...args) => thisIC.getManagementCanister(...args),
          callClientRPC: (...args) => thisIC.callClientRPC(...args),
          requestBurnXTC: (...args) => thisIC.requestBurnXTC(...args),
          batchTransactions: (...args) => thisIC.batchTransactions(...args),
        }
        state = {
          principal,
          signedIn: true,
          wallet,
          provider: {
            name,
            ic: window.ic.plug,
          },
        }
      } catch (e) {
        // TODO: handle
        return
      }
      if (!window.ic.plug) {
        window.open("https://plugwallet.ooo/", "_blank")
        // TODO: throw?
        return
      }
      return state
    },
    disconnect: async () => {
      // TODO: not the best way?
      await window.ic.plug.disconnect()
      state = {}
    },
  }
}

export default Plug