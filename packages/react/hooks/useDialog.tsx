import React, { useContext, useEffect, useState } from "react"
import { Connect2ICContext } from "../context"

export const useDialog = (props = {}) => {
  const { dialog } = useContext(Connect2ICContext)

  const loading = false
  const error = false

  return [dialog, { loading, error }]
}

