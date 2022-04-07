import React from "react"
import { infinityLogo } from "@connect2ic/core"

const StoicButton = ({ dark = false, ...props }) => {
  return (
    <button className="button-styles infinity-styles"
            style={dark ? {} : { background: "#f4f4f4", color: "black" }} {...props}>
      <img style={{ width: "55px" }} className={"img-styles"} src={infinityLogo} />
      <div>
        <span className="button-label">Infinity Wallet</span>
        <span>Connect with your Infinity Wallet</span>
      </div>
    </button>
  )
}

export default StoicButton
