import React, { useContext, useEffect, useRef, useState } from "react"
import { useSelector } from "@xstate/react"
import { Connect2ICContext } from "../context"

const selectState = state => ({
  identity: state.context.identity,
  principal: state.context.principal,
  provider: state.context.provider,
  status: state.value.idle?.auth,
})

export const useConnect = (props = {}) => {
  // TODO: handle
  const {
    onConnect = () => {
    },
    onDisconnect = () => {
    },
  } = props
  const {
    connectService,
    action,
  } = useContext(Connect2ICContext)
  const state = useSelector(connectService, selectState)

  useEffect(() => {
    // TODO: Fires multiple times? Fix
    if (action === "onConnect") {
      onConnect()
    }
    if (action === "onDisconnect") {
      onDisconnect()
    }
  }, [action])

  return {
    ...state,
    connect: (provider) => {
      connectService.send({ type: "CONNECT", data: { provider } })
    },
    disconnect: () => {
      connectService.send({ type: "DISCONNECT" })
    },
  }
}

