import React, { useEffect, useRef } from "react"
import { useDialog } from "../hooks"
import { useProviders } from "../hooks"
import { useConnect } from "../hooks"

const ConnectDialog = (props) => {
  const {
    onClose = () => {
      dialog.close()
    },
    children,
    dark,
    title,
  } = props

  const dialog = useDialog()
  const providers = useProviders()

  const { connect, status } = useConnect()

  useEffect(() => {
    if (status === "connected") {
      dialog.close()
    }
  }, [status])

  useEffect(() => {
    if (dialog.isOpen) {
      document.body.style.overflow = "hidden"
    }
    if (!dialog.isOpen) {
      document.body.style.overflow = "unset"
    }
  }, [dialog.isOpen])

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        dialog.close()
      }
    }
    window.addEventListener("keydown", handleEsc)

    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [])

  const onClickInside = (e) => {
    e.stopPropagation()
  }

  return dialog.isOpen ? (
    <>
      <div className={`dialog-styles ${dark ? "dark" : "light"}`} onClick={onClose}>
        <div onClick={onClickInside} className="dialog-container">
          <div>
            {providers.map((provider) => {
              return (
                <button onClick={() => connect(provider.id)}
                        className={`button-styles ${provider.id}-styles`} {...props}>
                  <img className={"img-styles"} src={dark ? provider.icon.dark : provider.icon.light} />
                  <div>
                    <span className="button-label">{provider.name}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </>
  ) : null
}

export default ConnectDialog