import React, { useEffect } from "react"
import { useDialog } from "./hooks/useDialog"
import { useProviders } from "./hooks/useProviders"
import { useConnect } from "./hooks/useConnect"
import { AstroXButton, IIButton, InfinityButton, PlugButton, StoicButton, NFIDButton } from "./index"

const Dialog = (props) => {
  const {
    onClose = () => {
      dialog.close()
    },
    children,
    dark,
    title,
  } = props

  const onClickInside = (e) => {
    e.stopPropagation()
  }

  const providerButtons = {
    astrox: AstroXButton,
    ii: IIButton,
    infinity: InfinityButton,
    nfid: NFIDButton,
    plug: PlugButton,
    stoic: StoicButton,
  }

  const [dialog] = useDialog()
  const [providers] = useProviders()

  // TODO: provider.connect instead?
  const { connect, disconnect, status } = useConnect()

  useEffect(() => {
    if (status === "connected") {
      dialog.close()
    }
  }, [status])

  return dialog.isOpen ? (
    <>
      <div onClick={onClose} className={`dialog-styles ${dark ? "dark" : "light"}`}>
        <div onClick={onClickInside} className="dialog-container">
          {title ? (
            <h2>{title}</h2>
          ) : null}
          {providers.map((provider) => {
            const ProviderButton = providerButtons[provider.id]
            return (
              <ProviderButton key={provider.id} onClick={() => connect(provider.id)} dark={dark} />
            )
          })}
        </div>
      </div>
    </>
  ) : null
}

export default Dialog