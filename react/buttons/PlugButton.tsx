import React from "react"
import plugDark from "../../assets/plugDark.svg"
import plugLight from "../../assets/plugLight.svg"
import "../../connect2ic.css"

const PlugButton = ({ dark = false, ...props }) => {
  return (
    <button className="button-styles plug-styles"
            style={dark ? {} : { background: "#f4f4f4", color: "black" }} {...props}>
      <img className={"img-styles"} src={dark ? plugDark : plugLight} />
      <div>
        <span className="button-label">Plug</span>
        <span>Connect with your Plug wallet</span>
      </div>
    </button>
  )
}

export default PlugButton