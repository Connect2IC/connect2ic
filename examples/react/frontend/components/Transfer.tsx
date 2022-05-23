import { useConnect, useSignMessage, useTransfer } from "@connect2ic/react"
import React, { useEffect, useRef, useState } from "react"

const Transfer = () => {
  /*
  * This how you use canisters throughout your app.
  * "counter" is the name we pass in to <ConnectProvider canisters={canisterMap} />
  */
  // TODO: wallet still there after logging out?
  const { isWallet } = useConnect()
  const [amount, setAmount] = useState(5)
  const [transfer] = useTransfer({
    from: "fdbe41c9e8589e115e6187038fc99e3b0c6fea116b1084b95c0da152520db3d1",
    to: "fdbe41c9e8589e115e6187038fc99e3b0c6fea116b1084b95c0da152520db3d1",
    amount: Number(amount),
  })

  const onPurchase = () => {
    transfer()
  }

  return (
    <div className="example">
      {isWallet ? (
        <>
          <p>Buy me beer</p>
          <button className="connect-button" onClick={onPurchase}>Purchase</button>
        </>
      ) : (
        <p className="example-disabled">Connect with a wallet to access this example</p>
      )}
    </div>
  )
}

export { Transfer }