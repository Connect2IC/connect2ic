import React from "react"
import { dfinityLogo } from "@connect2ic/core"

const IIButton = ({ dark = false, ...props }) => {
  return (
    <button className="button-styles ii-styles"
            style={dark ? {} : { background: "#f4f4f4", color: "black" }} {...props}>
      <img style={{ width: "55px" }} className={"img-styles"} src={dfinityLogo} />
      <div>
        <span className="button-label">Internet Identity</span>
        <span>Connect with your Internet Identity</span>
      </div>
    </button>
  )
}

export default IIButton
