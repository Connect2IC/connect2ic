import React, { PropsWithChildren, useEffect } from "react"
import { useDialog } from "../hooks"
import { useProviders } from "../hooks"
import { useConnect } from "../hooks"

type Props = {
  onClose?: () => void
  dark?: boolean
}

const ConnectDialog: React.FC<PropsWithChildren<Props>> = (props) => {
  const {
    onClose = () => {
      dialog.close()
    },
    children,
    dark,
  } = props

  const dialog = useDialog()
  const providers = useProviders()

  const { connect, isConnected } = useConnect()

  useEffect(() => {
    if (isConnected) {
      dialog.close()
    }
  }, [isConnected])

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
                <button key={provider.id} onClick={() => connect(provider.id)}
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