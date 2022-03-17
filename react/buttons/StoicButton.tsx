import React from "react"
import stoicLogo from "../../assets/stoic.png"
import "../../connect2ic.css"

const StoicButton = ({ dark = false, ...props }) => {
  return (
    <button className="button-styles stoic-styles"
            style={dark ? {} : { background: "#f4f4f4", color: "black" }} {...props}>
      <img style={{ width: "55px" }} className={"img-styles"} src={stoicLogo} />
      <div>
        <span className="button-label">Stoic Wallet</span>
        <span>Connect with your Stoic Wallet</span>
      </div>
    </button>
  )
}

export default StoicButton
