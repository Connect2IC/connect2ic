import React from "react"
import { astroxLogo, astroxDarkLogo } from "@connect2ic/core"

const AstroXButton = ({ dark = false, ...props }) => {
  return (
    <>
      <button className={"button-styles ii-styles"} {...props}>
        <img style={{ height: "auto" }} className={"img-styles"} src={dark ? astroxDarkLogo : astroxLogo } />
        <div>
          <span className="button-label">AstroX ME</span>
          {/*<span>ConnectButton with your AstroX ME identity</span>*/}
        </div>
      </button>
    </>
  )
}

export default AstroXButton