import { useCanister } from "@connect2ic/react"
import React, { useEffect, useState } from "react"

const Counter = () => {
  /*
  * This how you use canisters throughout your app.
  * "counter" is the name we pass in to <ConnectProvider canisters={canisterMap} />
  */
  const [counter, { loading }] = useCanister("counter")
  const [count, setCount] = useState()

  const refreshCounter = async () => {
    const freshCount = await counter.getValue()
    setCount(freshCount)
  }

  const increment = async () => {
    await counter.increment()
    await refreshCounter()
  }

  useEffect(() => {
    if (loading) {
      return
    }
    refreshCounter()
  }, [counter, loading])

  return (
    <div className="example">
      <p style={{ fontSize: "2.5em" }}>{count?.toString()}</p>
      <button className="connect-button" onClick={increment}>+</button>
    </div>
  )
}

export { Counter }