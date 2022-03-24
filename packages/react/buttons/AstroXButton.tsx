import React from "react"
import { astroxLogo } from "@connect2ic/core"
import "@connect2ic/core/connect2ic.css"

const AstroXButton = ({ dark = false, ...props }) => {
  return (
    <>
      <button className={"button-styles ii-styles"}
              style={dark ? {} : { background: "#f4f4f4", color: "black" }} {...props}>
        <img style={{ width: "55px" }} className={"img-styles"} src={astroxLogo} />
        <div>
          <span className="button-label">AstroX</span>
          <span>Connect with your AstroX identity</span>
        </div>
      </button>
    </>
  )
}

export default AstroXButton