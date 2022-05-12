import { useWallet, useSignMessage, useTransfer } from "@connect2ic/react"
import React, { useEffect, useRef, useState } from "react"

const Transfer = () => {
  /*
  * This how you use canisters throughout your app.
  * "counter" is the name we pass in to <ConnectProvider canisters={canisterMap} />
  */
  // TODO: wallet still there after logging out?
  const [wallet] = useWallet()
  const [amount, setAmount] = useState(5)
  const [transfer] = useTransfer({
    from: "fdbe41c9e8589e115e6187038fc99e3b0c6fea116b1084b95c0da152520db3d1",
    to: "fdbe41c9e8589e115e6187038fc99e3b0c6fea116b1084b95c0da152520db3d1",
    amount: Number(amount),
  })

  // const [message, setMessage] = useState("")
  // const [signMessage, {}] = useSignMessage({
  //   message,
  // })

  const onPurchase = () => {
    transfer()
  }

  // const inputRef = useRef()

  return (
    <div className="example">
      {wallet ? (
        <>
          <p>Buy me 白酒</p>
          <button className="connect-button" onClick={onPurchase}>Purchase</button>
          {/*<form onSubmit={(e) => {*/}
          {/*  e.preventDefault()*/}
          {/*  setMessage(inputRef.current.value)*/}
          {/*  signMessage()*/}
          {/*}}>*/}
          {/*  <input ref={inputRef} type="text" />*/}
          {/*  <button type="submit">Sign</button>*/}
          {/*</form>*/}
        </>
      ) : (
        <p className="example-disabled">Connect with a wallet to access this example</p>
      )}
    </div>
  )
}

export { Transfer }