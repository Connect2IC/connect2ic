import dfinityLogo from "./assets/dfinity.svg"
import React, { useEffect, useState } from "react"
import { AuthClient } from "@dfinity/auth-client"
import "./connect2ic.css"

const useII = ({ onConnect }) => {
  const [client, setClient] = useState<any>()

  const initAuth = async () => {
    const client = await AuthClient.create()
    const isAuthenticated = await client.isAuthenticated()

    setClient(client)

    if (isAuthenticated) {
      const identity = client.getIdentity()
      const principal = identity.getPrincipal().toString()
      onConnect({ type: "ii", identity, principal })
    }
  }

  const disconnect = async () => {
    await client.logout()
  }

  const connect = async () => {
    const { identity, principal } = await new Promise((resolve, reject) => {
      client.login({
        identityProvider: "https://identity.ic0.app",
        onSuccess: () => {
          const identity = client.getIdentity()
          const principal = identity.getPrincipal().toString()
          resolve({ identity, principal })
        },
        onError: reject,
      })
    })
    onConnect({ type: "ii", identity, principal })
  }

  useEffect(() => {
    initAuth()
  }, [])

  return { connect, disconnect }
}

const IIConnect = ({ onClick }) => {
  return <>
    <button className={"button-styles ii-styles"} onClick={onClick}>
      <img className={"img-styles"} src={dfinityLogo} />
      Internet Identity
    </button>
  </>
}

export { useII, IIConnect }