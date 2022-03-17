import React from "react"
import MetamaskLogo from "../../assets/metamask-fox.svg"
import "../../connect2ic.css"

const IIButton = ({ dark = false, ...props }) => {
  return (
    <button className="button-styles metamask-styles"
            style={dark ? {} : { background: "#f4f4f4", color: "black" }} {...props}>
      <img style={{ width: "55px" }} className={"img-styles"} src={MetamaskLogo} />
      <div>
        <span className="button-label">Metamask</span>
        <span>Connect with your Metamask wallet</span>
      </div>
    </button>
  )
}

export default IIButton
