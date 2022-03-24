import React from "react"

const Dialog = ({
                  onClose = () => {
                  },
                  children,
                  ...props
                }) => {

  const onClickInside = (e) => {
    e.stopPropagation()
  }

  return (
    <div onClick={onClose} className="dialog-styles">
      <div onClick={onClickInside} className="dialog-container">
        {children}
      </div>
    </div>
  )
}

export default Dialog