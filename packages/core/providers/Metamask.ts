import { AuthClient } from "@dfinity/auth-client"

const provider = "metamask"

const Metamask = async (config = {
  whitelist: [],
  host: window.location.origin,
}) => {
  let client

  return {
    init: async () => {

    },
    name: provider,
    connect: () => {
    },
    disconnect: async () => {
    },
  }
}

export default Metamask
