import React from "react"
import { nfidLogo } from "@connect2ic/core"

const NFIDButton = ({ dark = false, ...props }) => {
  return (
    <button className="button-styles nfid-styles" {...props}>
      <img style={{ width: "55px" }} className={"img-styles"} src={nfidLogo} />
      <div>
        <span className="button-label">NFID</span>
        {/*<span>ConnectButton with your NFID</span>*/}
      </div>
    </button>
  )
}

export default NFIDButton
