import React, { useEffect, useState } from "react"
import { useConnect, useBalance } from "@connect2ic/react"

const Profile = () => {
  /*
  * This how you use canisters throughout your app.
  * "counter" is the name we pass in to <ConnectProvider canisters={{ counter }} />
  */
  const [assets] = useBalance()
  const { principal, isConnected, isWallet } = useConnect()

  return (
    <div className="example">
      {isConnected ? (
        <>
          <p>Principal: <span style={{ fontSize: "0.7em" }}>{principal}</span></p>
          <p>Wallet address: <span style={{ fontSize: "0.7em" }}>{isWallet ? principal : "-"}</span></p>
          <table>
            <tbody>
            {assets && assets.map(asset => (
              <tr key={asset.canisterId}>
                <td>
                  {asset.name}
                </td>
                <td>
                  {asset.amount}
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </>
      ) : (
        <p className="example-disabled">Connect to access this example</p>
      )}
    </div>
  )
}

export { Profile }