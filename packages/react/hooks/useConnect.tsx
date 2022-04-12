import React, { useContext, useEffect, useState } from "react"
import { useSelector } from "@xstate/react"
import { ConnectContext } from "../context"

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
  } = useContext(ConnectContext)
  const state = useSelector(connectService, selectState)

  useEffect(() => {
    if (!state) {
      return
    }
    if (state.status === "connected") {
      onConnect(state)
    }
    if (state.status === "disconnected") {
      onDisconnect()
    }
  }, [state.status])

  return {
    ...state,
    connect: (provider) => {
      connectService.send({ type: "CONNECT", provider })
    },
    disconnect: () => {
      connectService.send({ type: "DISCONNECT" })
    },
  }
}

