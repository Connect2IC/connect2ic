import React from "react"
import { dfinityLogo } from "@connect2ic/core"

const IIButton = ({ dark = false, ...props }) => {
  return (
    <button className="button-styles ii-styles" {...props}>
      <img style={{ width: "55px" }} className={"img-styles"} src={dfinityLogo} />
      <div>
        <span className="button-label">Internet Identity</span>
        {/*<span>ConnectButton with your Internet Identity</span>*/}
      </div>
    </button>
  )
}

export default IIButton
