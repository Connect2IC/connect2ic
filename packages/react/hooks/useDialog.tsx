import React, { useContext, useEffect, useState } from "react"
import { ConnectContext } from "../context"

export const useDialog = (props = {}) => {
  const { dialog } = useContext(ConnectContext)

  const loading = false
  const error = false

  return [dialog, { loading, error }]
}

