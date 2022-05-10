import React, { useContext, useEffect, useState } from "react"
import { Connect2ICContext } from "../context"

export const useDialog = (props = {}) => {
  const { dialog } = useContext(Connect2ICContext)

  return dialog
}

