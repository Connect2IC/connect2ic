import React from "react"
import { infinityLogo } from "@connect2ic/core"

const InfinityButton = ({ dark = false, ...props }) => {
  return (
    <button className="button-styles infinity-styles" {...props}>
      <img style={{ width: "55px" }} className={"img-styles"} src={infinityLogo} />
      <div>
        <span className="button-label">Infinity Wallet</span>
        {/*<span>Connect with your Infinity Wallet</span>*/}
      </div>
    </button>
  )
}

export default InfinityButton
