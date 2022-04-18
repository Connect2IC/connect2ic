import React from "react"
import { plugDark, plugLight } from "@connect2ic/core"

const PlugButton = ({ dark = false, ...props }) => {
  return (
    <button className="button-styles plug-styles" {...props}>
      <img className={"img-styles"} src={dark ? plugDark : plugLight} />
      <div>
        <span className="button-label">Plug</span>
        {/*<span>Connect with your Plug wallet</span>*/}
      </div>
    </button>
  )
}

export default PlugButton